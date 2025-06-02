<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<div
  class={cn('py-6 text-center text-sm', className)}
  data-cmdk-empty=""
  role="presentation"
  {...$$restProps}
>
  <slot>No results found.</slot>
</div>
