<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    value?: string;
    disabled?: boolean;
    onSelect?: (value: string) => void;
  };

  let className: $$Props['class'] = undefined;
  export { className as class };
  export let disabled: $$Props['disabled'] = undefined;
  export let value: $$Props['value'] = undefined;
  export let onSelect: $$Props['onSelect'] = undefined;
</script>

<div
  class={cn(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    className
  )}
  data-disabled={disabled || undefined}
  data-value={value}
  role="option"
  aria-selected="false"
  data-cmdk-item=""
  on:click={() => {
    if (!disabled && value && onSelect) {
      onSelect(value);
    }
  }}
  {...$$restProps}
>
  <slot />
</div>
