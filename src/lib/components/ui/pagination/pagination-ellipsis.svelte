<script lang="ts">
  import { cn } from "$lib/utils";

  let className = "";
  export { className as class };
</script>

<span
  class={cn("flex h-9 w-9 items-center justify-center", className)}
  {...$$restProps}
>
  <span class="text-muted-foreground">...</span>
</span>
