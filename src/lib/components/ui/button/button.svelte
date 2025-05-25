<script lang="ts">
  import { cn } from "$lib/utils";
  
  // Define button variants and sizes with type safety
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  } as const;
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  } as const;

  // Define prop types
  type Variant = keyof typeof variants;
  type Size = keyof typeof sizes;
  type ButtonType = 'button' | 'submit' | 'reset';

  // Get props with TypeScript types
  const {
    variant = 'default',
    size = 'default',
    type = 'button',
    class: className = '',
    onClick = () => {},
    children
  } = $props<{
    variant?: Variant;
    size?: Size;
    type?: ButtonType;
    class?: string;
    onClick?: (event: MouseEvent) => void;
    children?: any;
  }>();
  
  // Safely get classes with type assertions
  const variantClass = variants[variant as Variant] || variants.default;
  const sizeClass = sizes[size as Size] || sizes.default;
  
  // Combine classes
  const classes = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantClass,
    sizeClass,
    className
  );
  
  // Handle click event
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    onClick(event);
  }
</script>

<button
  class={classes}
  {type}
  onclick={handleClick}
>
  {@render children()}
</button>
