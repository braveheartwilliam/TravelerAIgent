<script lang="ts">
  import { cn } from "$lib/utils";
  import { getTooltipContext } from "./tooltip-provider.svelte";
  import { melt } from "@melt-ui/svelte";
  import Portal from "svelte-portal";
  import { fade } from "svelte/transition";

  const { content, open } = getTooltipContext();

  let className: string | undefined = undefined;
  export { className as class };

  export let side: "top" | "right" | "bottom" | "left" = "top";
  export let sideOffset = 4;
  export let align: "start" | "center" | "end" = "center";
  export let alignOffset = 0;
</script>

{#if $open}
  <Portal target="body">
    <div
      use:melt={$content}
      transition:fade={{ duration: 150 }}
      class={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style:--side-offset="{sideOffset}px"
      style:--align-offset="{alignOffset}px"
      data-side={side}
      data-align={align}
    >
      <slot />
    </div>
  </Portal>
{/if}
