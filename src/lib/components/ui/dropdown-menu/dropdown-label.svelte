<!-- src/lib/components/ui/dropdown-menu/dropdown-label.svelte -->
<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  type $$Props = DropdownMenuPrimitive.LabelProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Label
  {...$$restProps}
  class={cn("px-2 py-1.5 text-sm font-semibold", className)}
>
  <slot />
</DropdownMenuPrimitive.Label>
