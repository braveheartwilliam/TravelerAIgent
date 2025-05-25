<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { navigation, defaultNavItems } from '$lib/stores/navigation';
  import type { User } from '$lib/types';
  import type { PageData } from './types';
  import MainNav from '$lib/components/navigation/MainNav.svelte';
  import Sidebar from '$lib/components/navigation/Sidebar.svelte';
  import ThemeProvider from '$lib/components/theme/ThemeProvider.svelte';
  import type { Snippet } from 'svelte';

  // Slots type for Svelte 5
  let { children } = $props<{ children: Snippet }>();

  // Use runes for reactive state
  let currentPath = $page.url.pathname;
  let user: User | null = null;
  let isCheckingAuth = true;
  
  // Initialize navigation
  $effect(() => {
    navigation.setItems(defaultNavItems);
    navigation.updateActiveState($page.url.pathname);
  });
  
  // Track authentication state
  let isAuthenticated = $state(false);
  let currentUser = $state<User | null>(null);
  
  // Initialize user from page data
  $effect(() => {
    const pageData = $page.data as PageData;
    if (pageData?.user) {
      currentUser = pageData.user;
      isAuthenticated = true;
    } else if (pageData?.session?.user) {
      currentUser = pageData.session.user;
      isAuthenticated = true;
    } else {
      currentUser = null;
      isAuthenticated = false;
    }
  });
  
  // Update state when page changes
  $effect(() => {
    currentPath = $page.url.pathname;
    const pageData = $page.data as PageData;
    if (pageData?.user) {
      currentUser = pageData.user;
    }
  });
  
  // Handle authentication state changes and redirects
  $effect(() => {
    if (typeof window === 'undefined') return; // Skip on server-side
    
    const currentPath = window.location.pathname;
    
    if (!isAuthenticated) {
      // Only redirect if we're not already on the sign-in page
      if (!currentPath.startsWith('/auth/signin')) {
        const callbackUrl = encodeURIComponent(currentPath + window.location.search);
        console.log('Not authenticated, redirecting to sign-in');
        window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
      }
    } else if (currentPath === '/auth/signin' || currentPath === '/auth/signin/') {
      // If already authenticated and on sign-in page, redirect to dashboard
      console.log('Already authenticated, redirecting to dashboard');
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl') || '/__protected__/dashboard';
      window.location.href = callbackUrl;
    }
  });
  
  // Check authentication status on mount
  onMount(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          user = data.user;
          isAuthenticated = true;
        } else {
          user = null;
          isAuthenticated = false;
        }
      } else {
        user = null;
        isAuthenticated = false;
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      user = null;
      isAuthenticated = false;
    }
  });
  
  // Handle click events to close mobile menu when clicking outside
  function handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isClickInsideNav = target.closest('nav') !== null;
    
    if (!isClickInsideNav && navigation.isMobileOpen) {
      closeMobileMenu();
    }
  }
  
  // Add click handler to the document for outside clicks
  onMount(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
  
  // Handle keyboard events for accessibility
  function handleKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    navigation.toggleMobileMenu();
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    navigation.closeMobileMenu();
  }
</script>

<div class="min-h-screen bg-background">
  <ThemeProvider>
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main content area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top navigation -->
        <MainNav />
        
        <!-- Page content -->
        <main class="flex-1 overflow-y-auto" aria-label="Main content">
          <div class="container mx-auto p-4">
            {#if isAuthenticated && currentUser}
              {@render children()}
            {:else}
              <div class="flex items-center justify-center h-64">
                <div class="text-center">
                  <h2 class="text-2xl font-bold mb-4">Please sign in to continue</h2>
                  <a
                    href="/auth/signin?callbackUrl={$page.url.pathname}"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Sign In
                  </a>
                </div>
              </div>
            {/if}
          </div>
        </main>
      </div>
    </div>
  </ThemeProvider>
</div>
