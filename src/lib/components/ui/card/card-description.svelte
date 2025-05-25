<script lang="ts">
  import { cn } from "$lib/utils.js";

  const { 
    class: className = "", 
    children = () => ({}),
    ...restProps 
  } = $props<{ 
    class?: string;
    children?: () => any;
    [key: string]: any; 
  }>();
</script>

<div class={cn("flex flex-col space-y-1.5 p-6", className)} {...restProps}>
  {@render children()}
</div>
