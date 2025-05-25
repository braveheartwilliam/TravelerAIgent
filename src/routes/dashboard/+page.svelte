<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';

  let isLoading = true;
  
  onMount(() => {
    // If user is not logged in, redirect to sign in
    if (!$page.data.user) {
      goto('/auth/signin');
    } else {
      isLoading = false;
    }
  });

  async function handleSignOut() {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Signed out successfully!');
        window.location.href = '/';
      } else {
        throw new Error('Failed to sign out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    {#if isLoading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading dashboard...</p>
      </div>
    {:else if $page.data.user}
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Welcome, {$page.data.user.name || 'User'}!</h1>
            <p class="text-gray-600">You're now signed in to your account.</p>
          </div>
          <button
            on:click={handleSignOut}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign out
          </button>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Your Account Information</h2>
          <div class="space-y-2">
            <div class="flex">
              <span class="w-32 text-sm font-medium text-gray-500">Name:</span>
              <span class="text-sm text-gray-900">{$page.data.user.name || 'Not provided'}</span>
            </div>
            <div class="flex">
              <span class="w-32 text-sm font-medium text-gray-500">Email:</span>
              <span class="text-sm text-gray-900">{$page.data.user.email}</span>
            </div>
            <div class="flex">
              <span class="w-32 text-sm font-medium text-gray-500">Role:</span>
              <span class="text-sm text-gray-900 capitalize">{$page.data.user.role}</span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
