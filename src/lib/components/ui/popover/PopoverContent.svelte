<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { getContext } from 'svelte';
  import { scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  
  export let className = '';
  export let align = 'center';
  export let sideOffset = 4;
  
  // Get the context with proper typing
  const popoverContext = getContext<{
    content: any;
    trigger: any;
    arrow: any;
    open: any;
  }>('popover');
  
  // Extract the content and open state
  const content = popoverContext?.content;
  const open = popoverContext?.open;
</script>

{#if $open}
  <div
    use:content={{
      align,
      sideOffset
    }}
    class={cn(
      'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    transition:scale={{
      start: 0.95,
      opacity: 0,
      duration: 150,
      easing: cubicOut
    }}
    {...$$restProps}
  >
    <slot />
  </div>
{/if}
