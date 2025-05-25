<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  let user: any = null;
  let loading = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        user = await res.json();
      } else {
        toast.error('Please sign in to access this page');
        await goto('/auth/signin');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('An error occurred while loading the page');
      await goto('/auth/signin');
    } finally {
      loading = false;
    }
  });

  async function handleSignOut() {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST'
      });
      
      if (res.ok) {
        toast.success('Successfully signed out');
        await goto('/');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to sign out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred while signing out');
    }
  }
</script>

<svelte:head>
  <title>Protected Page</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <div class="bg-white shadow rounded-lg p-6">
      {#if loading}
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      {:else if user}
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-5">
            <h1 class="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
            <p class="mt-2 text-sm text-gray-600">You have successfully signed in to your account.</p>
          </div>
          
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  This is a protected page. Only authenticated users can see this content.
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 class="text-lg leading-6 font-medium text-gray-900">User Information</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information about your account.</p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email address</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Role</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button
              on:click={handleSignOut}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</main>
