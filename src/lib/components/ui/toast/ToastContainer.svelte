<script lang="ts">
  import { toasts } from '.';
  import Toast from './Toast.svelte';
</script>

<div 
  class="fixed top-0 z-[100] flex flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:max-w-[420px]"
  aria-live="assertive"
  aria-atomic="true"
>
  {#each $toasts.toasts as toast (toast.id)}
    <Toast {toast} />
  {/each}
</div>
