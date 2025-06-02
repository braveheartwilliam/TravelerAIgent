<script lang="ts">
  import { createPopover } from '@melt-ui/svelte';
  import { setContext } from 'svelte';

  // Define the context type internally
  type PopoverContext = {
    content: any;
    trigger: any;
    arrow: any;
    open: any;
  };

  const { elements, states } = createPopover();
  
  const { content, trigger, arrow } = elements;
  const { open } = states;
  
  // Set the context with the type
  setContext<PopoverContext>('popover', {
    content,
    trigger,
    arrow,
    open
  });
</script>

<slot />
