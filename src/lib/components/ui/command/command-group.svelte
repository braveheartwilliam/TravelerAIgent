<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    heading?: string;
  };

  let className: $$Props['class'] = undefined;
  export { className as class };
  export let heading: $$Props['heading'] = undefined;
</script>

<div
  class={cn(
    'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
    className
  )}
  {...$$restProps}
  role="group"
  data-cmdk-group=""
>
  {#if heading}
    <div cmdk-group-heading="">{heading}</div>
  {/if}
  <slot />
</div>
