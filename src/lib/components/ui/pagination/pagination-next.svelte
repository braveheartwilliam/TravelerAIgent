<script lang="ts">
  import { cn } from "$lib/utils";
  import { ChevronRight } from "lucide-svelte";

  let className = "";
  export { className as class };
</script>

<a
  class={cn(
    "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
    className
  )}
  {...$$restProps}
>
  <span class="sr-only">Next page</span>
  <ChevronRight class="h-4 w-4" />
</a>
