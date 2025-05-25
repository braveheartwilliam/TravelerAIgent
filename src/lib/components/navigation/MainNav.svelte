<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { browser } from '$app/environment';
  
  // Define user type
  type User = {
    id: string;
    email: string;
    name: string | null;
    role: string;
  } | null;
  
  // Get props with proper typing
  const props = $props<{
    user?: User | null;
    handleSignOut?: () => Promise<void>;
  }>();
  
  // Default handleSignOut implementation
  const handleSignOut = $derived(
    props.handleSignOut ||
    (() => {
      if (browser) {
        window.location.href = '/api/auth/signout';
      }
      return Promise.resolve();
    })
  );
  
  // Get user from props or page data
  const user = $derived(props.user || $page.data?.user || null);
  
  // Get user initials for display
  const userInitials = $derived(
    user?.name
      ? user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
      : '?'
  );
  
  // Handle navigation
  function navigateTo(path: string) {
    if (browser) {
      window.location.href = path;
    }
  }
  
  // Handle navigation with proper event type
  function handleNavigate(path: string, event: Event) {
    event.preventDefault();
    navigateTo(path);
  }
</script>

<nav class="bg-gray-800 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-xl font-bold">TravelerAIgent</a>
    
    <div class="flex items-center space-x-4">
      {#if user}
        <div class="flex items-center space-x-4">
          <Button on:click={(e) => handleNavigate('/trips/new', e)}>
            New Trip
          </Button>
          <div class="relative">
            <Button 
              variant="ghost" 
              on:click={(e) => {
                e.preventDefault();
                handleSignOut();
              }}
              class="p-0 h-10 w-10"
            >
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {userInitials}
              </div>
            </Button>
          </div>
        </div>
      {:else}
        <a href="/api/auth/signin" class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Sign In
        </a>
      {/if}
    </div>
  </div>
</nav>
