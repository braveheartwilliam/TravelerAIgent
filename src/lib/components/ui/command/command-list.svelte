<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<div
  class={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
  role="listbox"
  data-cmdk-list=""
  {...$$restProps}
>
  <slot />
</div>
