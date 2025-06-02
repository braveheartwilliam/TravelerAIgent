<script lang="ts">
  import { melt } from "@melt-ui/svelte";
  import { getTooltipContext } from "./tooltip-provider.svelte";

  const { trigger } = getTooltipContext();
</script>

<div use:melt={$trigger}>
  <slot />
</div>
