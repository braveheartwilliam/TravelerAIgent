<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { getContext } from 'svelte';
  
  export let asChild = false;
  
  // Get the context with proper typing
  const popoverContext = getContext<{
    trigger: any;
    content: any;
    arrow: any;
    open: any;
  }>('popover');
  
  // Extract the trigger function
  const trigger = popoverContext?.trigger;
  
  export let builders: Function[] = [];
  
  if (asChild && trigger) {
    builders = [...builders, trigger];
  }
</script>

{#if asChild}
  <slot {builders} />
{:else}
  <button type="button" use:trigger {...$$restProps}>
    <slot />
  </button>
{/if}
