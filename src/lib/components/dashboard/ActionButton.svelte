<script lang="ts">
  // Use $props() for Svelte 5 runes compatibility
  const { 
    href = '',
    label = '',
    icon = '',
    variant = 'primary' as const
  } = $props<{
    href: string;
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary';
  }>();
  
  // Define button classes based on variant
  const buttonClass = variant === 'secondary' 
    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800'
    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800';
  
  // Track hover state for animations
  let hovered = $state(false);
</script>

<a 
  href={href}
  class="px-6 py-3 {buttonClass} text-white text-base font-medium rounded-lg shadow-md 
         hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 dark:focus:ring-offset-gray-900
         flex items-center justify-center w-full sm:w-auto"
  aria-label={label}
  onmouseenter={() => hovered = true}
  onmouseleave={() => hovered = false}
>
  {#if icon}
    <span class="mr-2 transition-transform duration-200 {hovered ? 'scale-110' : ''}" aria-hidden="true">
      {@html icon}
    </span>
  {/if}
  <span>{label}</span>
</a>
