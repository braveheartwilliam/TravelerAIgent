<script lang="ts">
  import { Dialog, DialogContent } from '$lib/components/ui/dialog';
  import Command from './command.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };

  export let open: $$Props['open'] = false;
  export let onOpenChange: $$Props['onOpenChange'] = undefined;
</script>

<Dialog {open} onOpenChange={onOpenChange}>
  <DialogContent class="overflow-hidden p-0">
    <Command class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
      <slot />
    </Command>
  </DialogContent>
</Dialog>
