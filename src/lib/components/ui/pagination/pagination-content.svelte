<script lang="ts">
  import { cn } from "$lib/utils";

  let className = "";
  export { className as class };
</script>

<div class={cn("flex flex-row items-center gap-1", className)} {...$$restProps}>
  <slot />
</div>
