<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { CheckIcon } from 'lucide-svelte';

  export let checked = false;
  export let disabled = false;
  export let id: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let value: string | undefined = undefined;
  export let required = false;
  export let className = '';
</script>

<div class="flex items-center">
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-required={required}
    data-state={checked ? 'checked' : 'unchecked'}
    {disabled}
    {id}
    {name}
    {value}
    on:click={() => {
      if (!disabled) {
        checked = !checked;
        const event = new CustomEvent('change', { detail: { checked } });
        dispatchEvent(event);
      }
    }}
    class={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
  >
    {#if checked}
      <CheckIcon class="h-4 w-4" />
    {/if}
  </button>
</div>
