<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import ThemeToggle from '../theme-toggle/theme-toggle.svelte';
  import { mdiAccount, mdiLogout } from '@mdi/js';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Derive user from page data
  const user = $derived($page?.data?.user ?? null);

  async function handleSignIn() {
    try {
      await goto('/auth/signin');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }

  async function handleSignOut() {
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
  
  // Create event handlers for the buttons
  const signInButtonProps = {
    variant: 'ghost' as const,
    class: 'ml-2',
    onClick: handleSignIn
  };
  
  const signOutButtonProps = {
    class: 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-transparent hover:bg-accent hover:text-accent-foreground',
    onClick: handleSignOut,
    'aria-label': 'Sign out'
  };
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-14 items-center">
    <div class="mr-4 flex">
      <a class="mr-6 flex items-center space-x-2" href="/">
        <span class="font-bold">TravelerAIgent</span>
      </a>
    </div>
    <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      <nav class="flex items-center space-x-6 text-sm font-medium">
        <a
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          href="/"
          >Home</a
        >
        <a
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          href="/dashboard"
          >Dashboard</a
        >
      </nav>
      <div class="flex items-center space-x-2">
        <ThemeToggle />
        {#if user}
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium">{user.name || user.email}</span>
              <Button {...signOutButtonProps}>
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d={mdiLogout} />
                </svg>
              </Button>
            </div>
          </div>
        {:else}
          <Button {...signInButtonProps}>
            <svg
              class="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d={mdiAccount} />
            </svg>
            Sign In
          </Button>
        {/if}
      </div>
    </div>
  </div>
</header>
