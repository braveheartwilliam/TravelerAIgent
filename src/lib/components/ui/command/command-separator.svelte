<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<hr
  class={cn('-mx-1 h-px bg-border', className)}
  data-cmdk-separator=""
  {...$$restProps}
/>
