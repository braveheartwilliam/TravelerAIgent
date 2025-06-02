<script lang="ts">
  import { cn } from '$lib/utils/cn';
  
  export let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  export let className = '';
</script>

<span
  class={cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/80',
    variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    variant === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground',
    className
  )}
  {...$$restProps}
>
  <slot />
</span>
