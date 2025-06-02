<script lang="ts">
  import { createSlider } from "@melt-ui/svelte";
  import { cn } from "$lib/utils";
  import { writable } from "svelte/store";
  
  export let value: number[] = [0];
  export let onValueChange: ((value: number[]) => void) | undefined = undefined;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let className: string | undefined = undefined;
  
  const valueStore = writable(value);
  
  // Create the slider
  const {
    elements: { root, range, thumbs },
    states: { value: sliderValue }
  } = createSlider({
    value: valueStore,
    min,
    max,
    step,
    onValueCommitted: (value: number[]) => {
      if (onValueChange) {
        onValueChange(value);
      }
    }
  });
  
  // Update the value when it changes externally
  $: {
    if (JSON.stringify(value) !== JSON.stringify($sliderValue)) {
      valueStore.set(value);
    }
  }
</script>

<div 
  use:root
  class={cn("relative flex w-full touch-none select-none items-center", className)}
>
  <div 
    class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
    data-melt-slider-track
  >
    <div 
      use:range
      class="absolute h-full bg-primary"
    ></div>
  </div>
  
  {#each $sliderValue as _, i}
    {@const thumbAction = $thumbs ? $thumbs[i]?.action : undefined}
    {#if thumbAction}
      <div 
        use:thumbAction
        class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      ></div>
    {/if}
  {/each}
</div>
