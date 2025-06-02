<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { navigation, defaultNavItems } from '$lib/stores/navigation';
  import type { User } from '$lib/types';
  import type { PageData } from './types';
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
  
  // Track dark mode state
  let darkMode = $state(false);
  
  // Initialize user from page data
  $effect(() => {
    const pageData = $page.data as PageData;
    console.log('Page data updated:', pageData);
    
    // Get user from page data or session
    const userData = pageData?.user || pageData?.session?.user;
    
    if (userData) {
      console.log('User data found in page data:', userData);
      currentUser = userData;
      isAuthenticated = true;
      
      // Store user in window for client-side hydration
      if (typeof window !== 'undefined') {
        (window as any).__user__ = userData;
      }
    } else {
      console.log('No user data found in page data, checking session...');
      currentUser = null;
      isAuthenticated = false;
      
      // Only redirect if we're not already on the sign-in page
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('signin') && 
          !window.location.pathname.includes('auth')) {
        const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
        console.log('Redirecting to sign-in from effect');
        window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
      }
    }
  });
  
  // Handle authentication state changes and redirects
  $effect(() => {
    if (typeof window === 'undefined') return; // Skip on server-side
    
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'path:', window.location.pathname);
    
    if (!isAuthenticated) {
      // Only redirect if we're not already on the sign-in page
      if (!window.location.pathname.includes('signin') && 
          !window.location.pathname.includes('auth')) {
        const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
        console.log('Not authenticated, redirecting to sign-in');
        window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
      }
    } else if (window.location.pathname === '/auth/signin' || 
               window.location.pathname === '/auth/signin/') {
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
      console.log('Checking auth status on mount...');
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Session check response:', data);
        
        if (data?.user) {
          currentUser = data.user;
          isAuthenticated = true;
          
          // Store user in window for client-side hydration
          if (typeof window !== 'undefined') {
            (window as any).__user__ = data.user;
          }
        } else {
          console.log('No user in session response');
          currentUser = null;
          isAuthenticated = false;
        }
      } else {
        console.log('Session check failed with status:', response.status);
        currentUser = null;
        isAuthenticated = false;
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      currentUser = null;
      isAuthenticated = false;
    } finally {
      isCheckingAuth = false;
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
  <div class="flex flex-col min-h-screen">
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
