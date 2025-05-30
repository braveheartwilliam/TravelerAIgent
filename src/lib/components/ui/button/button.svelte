<script lang="ts">
  import { cn } from "$lib/utils";
  
  // Define types
  type ButtonVariant = 
    | "default" 
    | "destructive" 
    | "outline" 
    | "secondary" 
    | "ghost" 
    | "link";
    
  type ButtonSize = "default" | "sm" | "lg" | "icon";
  type ButtonType = "button" | "submit" | "reset";
  
  // Define styles
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  } as const;
  
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  } as const;

  // Props
  export let variant: keyof typeof variantStyles = "default";
  export let size: keyof typeof sizeStyles = "default";
  export let type: ButtonType = "button";
  export let className = "";
  export let disabled = false;
  export let ariaLabel: string | undefined = undefined;
  
  // Computed classes
  $: buttonClasses = cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant] || variantStyles.default,
    sizeStyles[size] || sizeStyles.default,
    className
  );
  
  // Handle click events
  function handleClick(event: MouseEvent) {
    if (type !== "submit") {
      event.preventDefault();
    }
    
    // Dispatch custom event
    const customEvent = new CustomEvent("click", {
      detail: { event },
      bubbles: true,
      cancelable: true
    });
    
    // Dispatch from the button element
    const button = event.currentTarget as HTMLButtonElement;
    if (button) {
      button.dispatchEvent(customEvent);
    }
  }
</script>

<button
  type={type}
  class={buttonClasses}
  disabled={disabled}
  aria-label={ariaLabel}
  on:click={handleClick}
  {...$$restProps}
>
  <slot />
</button>
