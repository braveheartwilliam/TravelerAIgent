<script lang="ts">
  import Header from '$lib/components/layout/Header.svelte';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
  
  console.log('App layout script executing');
  
  // Get props including children content
  let { children } = $props<{
    children: {
      default: {
        component: ComponentType<SvelteComponent>,
        props: Record<string, any>
      }
    }
  }>();
  
  // Get session safely
  const session = $derived($page.data?.session || null);
  const user = $derived(session?.user || null);
  const error = $derived($page.data?.['error'] || null);
  
  // Handle authentication state
  let unsubscribe: (() => void) | undefined;
  let isCheckingAuth = $state(false);
  
  async function checkAuth() {
    if (!browser || isCheckingAuth) return;
    isCheckingAuth = true;
    
    try {
      console.log('Checking auth state...');
      
      // If we're already on the sign-in page, don't redirect
      if (window.location.pathname.startsWith('/auth/')) {
        console.log('On auth page, skipping redirect');
        return;
      }
      
      // If we have an error, log it but don't redirect
      if (error) {
        console.error('Auth error:', error);
        return;
      }
      
      // If no user, redirect to sign in
      if (!user) {
        console.log('No user session, redirecting to sign in');
        const callbackUrl = window.location.pathname + window.location.search;
        // Use window.location to prevent SPA navigation issues
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
        return;
      }
      
      // If we have a user, log the successful auth
      console.log('User authenticated:', {
        id: user.id,
        name: user.name,
        email: user.email
      });
      
    } catch (err) {
      console.error('Error checking auth:', err);
    } finally {
      isCheckingAuth = false;
    }
  }
  
  onMount(() => {
    if (!browser) return;
    
    checkAuth();
    
    // Subscribe to page store changes
    unsubscribe = page.subscribe(() => {
      checkAuth();
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  });
  
  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });
</script>

<main class="min-h-screen bg-background">
  {#if error}
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  {/if}
  
  <div class="container mx-auto px-4 py-8">
    <Header />
    <div>
      {@render children.default.component(children.default.props)}
    </div>
  </div>
</main>
