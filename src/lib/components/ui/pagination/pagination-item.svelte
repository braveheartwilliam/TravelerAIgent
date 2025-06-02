<script lang="ts">
  import { cn } from "$lib/utils";

  let className = "";
  export { className as class };
</script>

<li class={cn("", className)} {...$$restProps}>
  <slot />
</li>
