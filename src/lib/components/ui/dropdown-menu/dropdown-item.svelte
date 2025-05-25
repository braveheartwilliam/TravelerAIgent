<!-- src/lib/components/ui/dropdown-menu/dropdown-item.svelte -->
<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  type $$Props = DropdownMenuPrimitive.ItemProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Item
  {...$$restProps}
  class={cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
>
  <slot />
</DropdownMenuPrimitive.Item>
