<script lang="ts">
  import { cn } from "$lib/utils.js";
  
  // Using $props() for component props in Svelte 5
  const { class: className, children = () => ({}), ...restProps } = $props<{
    class?: string;
    children?: () => any;
    [key: string]: any;
  }>();
</script>

<div
  class={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}
  {...restProps}
>
  {@render children()}
</div>
