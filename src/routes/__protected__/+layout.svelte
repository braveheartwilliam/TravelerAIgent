<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { navigation, defaultNavItems } from '$lib/stores/navigation';
  import { appStore } from '$lib/stores/app';
  import MainNav from '$lib/components/navigation/MainNav.svelte';
  import Sidebar from '$lib/components/navigation/Sidebar.svelte';
  import ThemeProvider from '$lib/components/theme/ThemeProvider.svelte';
  import { toast } from 'svelte-sonner';
  import type { Snippet } from 'svelte';

  // TypeScript interfaces
  interface User {
    id?: string;
    [key: string]: unknown;
  }
  
  interface AppState {
    isMobileMenuOpen: boolean;
    [key: string]: unknown;
  }

  // Slots type for Svelte 5
  let children: Snippet;

  // Use runes for reactive state
  let currentPath = $state($page.url.pathname);
  let user = $state($page.data?.user as User | undefined);
  
  // Derived state
  let isAuthenticated = $derived(!!user?.id);
  let appState = $derived($appStore as AppState);
  
  // Update state when page changes
  $effect(() => {
    currentPath = $page.url.pathname;
    user = $page.data?.user as User | undefined;
  });
  
  // Redirect to login if not authenticated
  $effect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const callbackUrl = encodeURIComponent(currentPath);
      goto(`/auth/signin?callbackUrl=${callbackUrl}`);
      toast.error('Please sign in to access this page');
    }
  });
  
  // Initialize navigation
  onMount(() => {
    navigation.setItems(defaultNavItems);
    
    // Close mobile menu on route change
    return () => {
      if (appStore && typeof appStore.update === 'function') {
        appStore.update((state: AppState) => ({
          ...state,
          isMobileMenuOpen: false,
        }));
      }
    };
  });
  
  // Close mobile menu when clicking outside
  function handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const isClickInsideNav = target.closest('nav') || target.closest('button[aria-label="Toggle mobile menu"]');
    
    if (!isClickInsideNav && appState?.isMobileMenuOpen && appStore && typeof appStore.update === 'function') {
      appStore.update((state: AppState) => ({
        ...state,
        isMobileMenuOpen: false,
      }));
    }
  }
  
  // Handle keyboard events for accessibility
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClickOutside(event);
    }
  }
  
  // Handle click events with proper typing
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    handleClickOutside(event);
  }
  
  // Handle keydown events with proper typing
  function handleKeyDownEvent(event: KeyboardEvent) {
    event.preventDefault();
    handleKeyDown(event);
  }
</script>

<ThemeProvider>
  <div class="min-h-screen bg-background font-sans antialiased">
    <div 
      class="h-full" 
      role="button"
      tabindex="0"
      onclick={handleClick}
      onkeydown={handleKeyDownEvent}
    >
      <div class="flex h-full flex-col">
        <header class="sticky top-0 z-40 border-b bg-background">
          <div class="container flex h-16 items-center justify-between py-4">
            <MainNav user={user} />
          </div>
        </header>
        <div class="flex flex-1">
          <Sidebar />
          <main class="flex-1 overflow-y-auto p-4">
            {#if isAuthenticated}
              <slot />
            {:else}
              <div class="flex items-center justify-center h-full">
                <div class="text-center">
                  <div 
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"
                    role="status"
                    aria-label="Loading..."
                  ></div>
                  <p class="mt-4 text-gray-600">Redirecting to sign in...</p>
                </div>
              </div>
            {/if}
          </main>
        </div>
      </div>
    </div>
  </div>
</ThemeProvider>
