import { createTooltip } from "@melt-ui/svelte";
import type { CreateTooltipProps } from "@melt-ui/svelte";

export function tooltip(node: HTMLElement, props: CreateTooltipProps = {}) {
  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createTooltip({
    positioning: {
      placement: "top",
    },
    openDelay: 200,
    closeDelay: 0,
    ...props,
  });

  function update(newProps: CreateTooltipProps) {
    // Update props if needed
  }

  // Set up the trigger element
  trigger.set(node);

  return {
    update,
    destroy() {
      // Clean up if necessary
    },
  };
}
