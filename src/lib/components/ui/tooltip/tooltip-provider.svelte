<script lang="ts" context="module">
  import { getContext, setContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { CreateTooltipReturn } from "@melt-ui/svelte";

  const TOOLTIP_CONTEXT_KEY = Symbol("tooltip");

  type TooltipContext = {
    trigger: Writable<HTMLElement | null>;
    content: Writable<HTMLElement | null>;
    arrow: Writable<HTMLElement | null>;
    open: Writable<boolean>;
  };

  export function getTooltipContext() {
    return getContext<TooltipContext>(TOOLTIP_CONTEXT_KEY);
  }
</script>

<script lang="ts">
  import { createTooltip } from "@melt-ui/svelte";

  export let openDelay = 200;
  export let closeDelay = 0;
  export let placement: "top" | "right" | "bottom" | "left" = "top";
  export let align: "start" | "center" | "end" = "center";
  export let arrowSize = 8;
  export let sideOffset = 4;
  export let alignOffset = 0;

  const tooltip = createTooltip({
    openDelay,
    closeDelay,
    positioning: {
      placement,
      align,
      sideOffset,
      alignOffset,
    },
  });

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = tooltip;

  setContext<TooltipContext>(TOOLTIP_CONTEXT_KEY, {
    trigger,
    content,
    arrow,
    open,
  });
</script>

<slot {tooltip} />
