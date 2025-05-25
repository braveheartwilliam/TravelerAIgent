<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";

  type $$Props = TabsPrimitive.ListProps;

  export { className as class };
  let className: string | undefined = undefined;
</script>

<TabsPrimitive.List
  class={cn(
    "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
    className
  )}
  {...$$restProps}
>
  <slot />
</TabsPrimitive.List>
