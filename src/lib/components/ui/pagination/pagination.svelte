<script lang="ts">
  import { cn } from "$lib/utils";

  let className = "";
  export { className as class };
</script>

<nav
  class={cn("mx-auto flex w-full justify-center", className)}
  aria-label="pagination"
  {...$$restProps}
>
  <slot />
</nav>
