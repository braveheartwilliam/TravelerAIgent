<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Home } from 'lucide-svelte';
  
  const error = $derived($page.error);
  const message = $derived(error?.message || 'Page Not Found');
  const status = $derived(error?.status || 404);
  
  function goHome() {
    window.location.href = '/';
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
  <div class="max-w-md w-full space-y-6">
    <div class="text-9xl font-bold text-gray-200">{status}</div>
    <h1 class="text-3xl font-bold text-gray-900">
      {#if status === 404}
        Page Not Found
      {:else}
        Something went wrong
      {/if}
    </h1>
    
    <p class="text-gray-600">
      {#if status === 404}
        The page you're looking for doesn't exist or has been moved.
      {:else}
        {message}
      {/if}
    </p>
    
    <div class="pt-6">
      <Button on:click={goHome} class="inline-flex items-center">
        <Home class="mr-2 h-4 w-4" />
        Go back home
      </Button>
    </div>
    
    {#if import.meta.env.DEV && error?.stack}
      <pre class="mt-8 p-4 bg-gray-100 rounded-md text-xs text-left overflow-x-auto">
        {error.stack}
      </pre>
    {/if}
  </div>
</div>
