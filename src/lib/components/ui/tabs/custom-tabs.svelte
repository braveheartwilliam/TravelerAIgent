<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";
  import { Tabs } from "$lib/components/ui/tabs";

  // Define strict string type for tab values
  export let value: string;
  export let onValueChange: (value: string) => void;
  export { className as class };
  let className: string | undefined = undefined;
</script>

<TabsPrimitive.Root
  class={cn("w-full", className)}
  value={value}
  onValueChange={(newValue) => {
    if (typeof newValue === 'string') {
      onValueChange(newValue);
    }
  }}
  {...$$restProps}
>
  <slot />
</TabsPrimitive.Root>
