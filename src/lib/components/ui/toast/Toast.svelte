<script lang="ts">
  import type { Toast, ToastVariant } from '.';
  import { fly, fade } from 'svelte/transition';
  import { toasts } from '.';
  
  export let toast: Toast;
  
  // Variant styling
  const getVariantClass = (variant: ToastVariant = 'default') => {
    switch (variant) {
      case 'destructive':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'success':
        return 'border-green-500 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-white text-gray-800';
    }
  };
  
  // Handle dismiss
  const handleDismiss = () => {
    toasts.dismiss(toast.id);
  };
</script>

<div
  class="pointer-events-auto relative flex w-full max-w-md rounded-lg border p-4 shadow-lg {getVariantClass(toast.variant)}"
  role="alert"
  in:fly={{ y: 50, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <div class="flex-1">
    <h3 class="font-medium">{toast.title}</h3>
    {#if toast.description}
      <div class="mt-1 text-sm opacity-90">{toast.description}</div>
    {/if}
  </div>
  <button
    class="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    on:click={handleDismiss}
    aria-label="Close"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  </button>
</div>
