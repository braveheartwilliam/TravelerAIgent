<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Toaster, toast } from 'svelte-sonner';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/tanstack';
  import MainNav from '$lib/components/navigation/MainNav.svelte';
  import { ScrollToTop } from '$lib/components/ui/scroll-to-top';
  import '$lib/styles/icon-fix.css';
  
  // State for the Footer component
  let Footer = $state<import('svelte').ComponentType | null>(null);
  
  // Get the user from page data
  const user = $derived($page.data?.user ?? null);
  
  // Get the page props with proper typing
  const { children } = $props();
  
  // Debug log function
  function debugLog(...args: any[]) {
    if (browser && import.meta.env.DEV) {
      console.log('[Auth Debug]', ...args);
    }
  }
  
  // Set the page title
  $effect(() => {
    if (browser) {
      document.title = 'TravelerAIgent' + (user?.name ? ` | ${user.name}` : '');
    }
  });
  
  // Handle sign out
  async function handleSignOut() {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Force a full page reload to clear any client-side state
        window.location.href = '/';
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to sign out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred while signing out');
    }
  }
  
  // Log user changes for debugging
  $effect(() => {
    if (!browser) return;
    
    // Log all cookies for debugging
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const parts = cookie.split('=').map(c => c.trim());
      if (parts.length >= 2) {
        const [key, ...valueParts] = parts;
        acc[key] = valueParts.join('=');
      }
      return acc;
    }, {} as Record<string, string>);
    
    debugLog('Cookies:', cookies);
    
    debugLog('User updated:', { 
      hasUser: !!user,
      userId: user?.id,
      currentPath: window.location.pathname,
      search: window.location.search,
      pageData: $page.data
    });
    
    // Log the current session from the cookie
    const sessionCookie = cookies['session'];
    if (sessionCookie) {
      try {
        // Handle URL-encoded JSON in the cookie
        const decodedValue = decodeURIComponent(sessionCookie);
        const sessionData = JSON.parse(decodedValue);
        debugLog('Session data from cookie:', sessionData);
      } catch (e) {
        console.error('Error parsing session cookie:', e);
      }
    }
  });
  
  // Initialize on mount
  onMount(() => {
    if (!browser) return;
    debugLog('Root layout mounted');
    
    // Dynamically import the Footer component
    import('$lib/components/layout/Footer.svelte')
      .then(module => {
        Footer = module.default;
      })
      .catch(err => {
        console.error('Failed to load Footer component:', err);
      });
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/app.css" />
</svelte:head>

<QueryClientProvider client={queryClient}>
<div class="relative min-h-screen bg-background font-sans antialiased">
  {#if $page.status === 500}
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
      <div class="text-center max-w-2xl">
        <h1 class="text-4xl font-bold mb-4">500 - Server Error</h1>
        <p class="text-lg mb-6">Something went wrong on our end. Please try again later.</p>
        <a href="/" class="text-indigo-600 hover:text-indigo-800 font-medium">
          Return to Home
        </a>
      </div>
    </div>
  {:else}
    <MainNav user={user} handleSignOut={handleSignOut} />
    
    <main class="flex-1">
      {#key $page.url.pathname}
        {@render children()}
      {/key}
    </main>
    
    {#if Footer}
      {@const FooterComponent = Footer}
      <FooterComponent />
    {/if}
    
    <Toaster position="top-right" />
    <ScrollToTop />
  {/if}
</div>
</QueryClientProvider>
