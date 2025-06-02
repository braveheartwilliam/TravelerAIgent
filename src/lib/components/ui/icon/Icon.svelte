<script lang="ts">
  // A wrapper component for Lucide icons to enforce consistent sizing
  
  // Use $props() for Svelte 5 runes compatibility
  const { icon, size = 16, strokeWidth = 1.5, class: className = '' } = $props<{
    icon: any;
    size?: number;
    strokeWidth?: number;
    class?: string;
  }>();
</script>

<svelte:component 
  this={icon} 
  size={size} 
  strokeWidth={strokeWidth}
  class={className}
  aria-hidden="true"
/>
