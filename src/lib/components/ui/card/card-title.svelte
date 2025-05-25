<script lang="ts">
  import type { HeadingLevel } from "./index.js";
  import { cn } from "$lib/utils.js";

  const { 
    class: className = "", 
    tag = "h3" as HeadingLevel, 
    children = () => ({}),
    ...restProps 
  } = $props<{ 
    class?: string; 
    tag?: HeadingLevel;
    children?: () => any;
    [key: string]: any; 
  }>();
</script>

<svelte:element
	this={tag}
	class={cn("text-lg font-semibold leading-none tracking-tight", className)}
	{...restProps}
>
	{@render children()}
</svelte:element>
