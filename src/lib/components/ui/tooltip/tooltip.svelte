<script lang="ts">
  import { fade } from "svelte/transition";
  import { cn } from "$lib/utils";
  
  export let text: string;
  export let open = false;
  
  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class="relative inline-block">
  <div 
    role="button"
    tabindex="0"
    on:mouseenter={() => (open = true)} 
    on:mouseleave={() => (open = false)}
    on:focus={() => (open = true)}
    on:blur={() => (open = false)}
    on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && (open = !open)}
  >
    <slot />
  </div>
  
  {#if open}
    <div
      transition:fade={{ duration: 150 }}
      class={cn(
        "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground",
        className
      )}
    >
      {text}
      <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary"></div>
    </div>
  {/if}
</div>
