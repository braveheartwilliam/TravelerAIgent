<!-- src/lib/components/ui/dropdown-menu/dropdown-trigger.svelte -->
<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  type $$Props = DropdownMenuPrimitive.TriggerProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Trigger {...$$restProps} class={cn(className)}>
  <slot />
</DropdownMenuPrimitive.Trigger>
