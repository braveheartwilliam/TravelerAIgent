<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  type $$Props = TabsPrimitive.ContentProps;

  export let value: $$Props["value"];
  export { className as class };
  let className: string | undefined = undefined;
</script>

<TabsPrimitive.Content
  class={cn(
    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className
  )}
  {value}
  {...$$restProps}
  let:open
>
  {#if open}
    <div
      transition:fly={{ y: 5, duration: 150, easing: cubicOut }}
      class="w-full"
    >
      <slot />
    </div>
  {/if}
</TabsPrimitive.Content>
