<script lang="ts">
  import { goto } from '$app/navigation';
  import { signOut } from '@auth/sveltekit/client';
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/card.svelte";
  import CardHeader from "$lib/components/ui/card/card-header.svelte";
  import CardTitle from "$lib/components/ui/card/card-title.svelte";
  import CardDescription from "$lib/components/ui/card/card-description.svelte";
  import CardContent from "$lib/components/ui/card/card-content.svelte";
  import Avatar from "$lib/components/ui/avatar/avatar.svelte";
  import AvatarFallback from "$lib/components/ui/avatar/avatar-fallback.svelte";
  import AvatarImage from "$lib/components/ui/avatar/avatar-image.svelte";
  import { toast } from 'svelte-sonner';
  import type { PageData } from './$types';

  // Types
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  // Get page data with proper typing
  const props = $props<{ data: PageData }>();
  
  // Derived state
  const session = $derived(props.data?.session);
  const user = $derived<User>(session?.user ?? {});
  const isLoading = $derived(!session && !props.data?.error);
  const error = $derived(props.data?.error);
  
  // Handle sign out with loading state and error handling
  let isSigningOut = $state(false);
  
  async function handleSignOut() {
    isSigningOut = true;
    try {
      await signOut({ redirect: false });
      // Force full page reload to clear all state
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      isSigningOut = false;
    }
  }
  
  // Redirect if no user
  $effect(() => {
    if (typeof window !== 'undefined' && !isLoading && !user?.email) {
      console.log('No authenticated user, redirecting to sign in');
      goto('/auth/signin');
    }
  });
  
  // Show error toast if there's an auth error
  $effect(() => {
    if (error) {
      console.error('Auth error:', error);
      toast.error('Authentication error. Please sign in again.');
    }
  });
  
  function getInitials(name: string | null | undefined): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
</script>

<main class="min-h-screen bg-background">
  {#if isLoading}
    <div class="min-h-[60vh] flex items-center justify-center">
      <div class="flex flex-col items-center space-y-4">
        <div class="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  {:else if error}
    <div class="container max-w-4xl py-12">
      <Card class="border-destructive">
        <CardHeader>
          <CardTitle class="text-destructive">Authentication Error</CardTitle>
          <CardDescription>There was an issue loading your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="mb-4">Please try refreshing the page or sign in again.</p>
          <Button variant="outline" on:click={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  {:else if user?.email}
    <div class="container px-4 py-8 md:py-12">
      <div class="flex flex-col space-y-8">
        <!-- Header -->
        <div class="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Welcome back, {user.name || 'Traveler'}!</h1>
            <p class="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button 
            variant="outline" 
            on:click={handleSignOut}
            disabled={isSigningOut}
            class="w-full sm:w-auto"
          >
            {#if isSigningOut}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing out...
            {:else}
              Sign Out
            {/if}
          </Button>
        </div>
        
        <!-- Profile Card -->
        <Card>
          <CardContent class="pt-6">
            <div class="flex flex-col space-y-6 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
              <Avatar class="h-24 w-24">
                {#if user.image}
                  <AvatarImage src={user.image} alt={user.name || 'User'} />
                {/if}
                <AvatarFallback class="text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div class="space-y-2">
                <h2 class="text-2xl font-semibold">{user.name || 'User'}</h2>
                <p class="text-muted-foreground">{user.email || 'No email provided'}</p>
                <div class="pt-2">
                  <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Active Account
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <!-- Additional Sections -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Preferences Card -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Preferences</CardTitle>
              <CardDescription>Manage your travel preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">Coming soon: Customize your travel experience</p>
            </CardContent>
          </Card>
          
          <!-- Recent Activity -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your recent actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  {/if}
</main>
