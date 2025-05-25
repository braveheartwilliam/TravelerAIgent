<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  type $$Props = TabsPrimitive.Props;

  export let value: $$Props["value"] = undefined;
  export let defaultValue: $$Props["defaultValue"] = undefined;
  export { className as class };
  let className: string | undefined = undefined;
</script>

<TabsPrimitive.Root
  class={cn("w-full", className)}
  {value}
  {defaultValue}
  {...$$restProps}
>
  <slot />
</TabsPrimitive.Root>
