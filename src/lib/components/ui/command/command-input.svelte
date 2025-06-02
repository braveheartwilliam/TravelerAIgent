<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLInputElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
  };

  let className: $$Props['class'] = undefined;
  export { className as class };
  
  export let value: $$Props['value'] = undefined;
  export let onValueChange: $$Props['onValueChange'] = undefined;
</script>

<div class="flex items-center border-b px-3" cmdk-input-wrapper="">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="mr-2 h-4 w-4 shrink-0 opacity-50"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
  <input
    type="text"
    class={cn(
      'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    value={value || ''}
    on:input={(e: Event) => {
      const target = e.currentTarget as HTMLInputElement;
      onValueChange?.(target.value);
    }}
    {...$$restProps}
  />
</div>
