<!-- src/lib/components/ui/dropdown-menu/dropdown-content.svelte -->
<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";
  import { fade } from "svelte/transition";

  type $$Props = DropdownMenuPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Content
  transition={fade}
  transitionConfig={{ duration: 100 }}
  {...$$restProps}
  class={cn(
    "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
    className
  )}
>
  <slot />
</DropdownMenuPrimitive.Content>
