<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { ArrowUp } from 'lucide-svelte';
  
  // Props
  const { 
    class: className = '',
    threshold = 300,
    behavior = 'smooth',
    size = 'icon',
    variant = 'outline',
    ...attrs
  } = $props<{
    class?: string;
    threshold?: number;
    behavior?: ScrollBehavior;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    [key: string]: any;
  }>();
  
  // State
  let visible = $state(false);
  
  // Handle scroll event
  function handleScroll() {
    visible = window.scrollY > threshold;
  }
  
  // Scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior
    });
  }
  
  onMount(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<div 
  class={cn(
    "fixed bottom-4 right-4 z-50 transition-opacity duration-300",
    visible ? "opacity-100" : "opacity-0 pointer-events-none",
    className
  )}
>
  <Button
    {variant}
    {size}
    aria-label="Scroll to top"
    title="Scroll to top"
    onclick={scrollToTop}
    {...attrs}
  >
    <ArrowUp class="h-4 w-4" />
    <span class="sr-only">Scroll to top</span>
  </Button>
</div>
