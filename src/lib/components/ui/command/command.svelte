<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<div
  class={cn(
    'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
    className
  )}
  data-cmdk-root=""
  role="dialog"
  aria-label="Command menu"
  {...$$restProps}
>
  <div data-cmdk-container="">
    <slot />
  </div>
</div>
