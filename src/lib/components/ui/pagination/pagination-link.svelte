<script lang="ts">
  import { cn } from "$lib/utils";

  let className = "";
  export { className as class };
  export let isActive = false;
  export let disabled = false;
  export let ariaLabel = "";
</script>

<button
  type="button"
  aria-current={isActive ? "page" : undefined}
  aria-disabled={disabled ? "true" : undefined}
  aria-label={ariaLabel}
  disabled={disabled}
  class={cn(
    "flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    disabled ? "pointer-events-none opacity-50" : "",
    className
  )}
  on:click
  on:keydown={(e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.click();
      }
    }
  }}
  {...$$restProps}
>
  <slot />
</button>
