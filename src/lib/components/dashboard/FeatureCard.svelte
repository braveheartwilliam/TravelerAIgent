<script lang="ts">
  // Use $props() for Svelte 5 runes compatibility
  const { title = '', description = '' } = $props<{
    title: string;
    description: string;
  }>();
  
  // For animation and interaction state
  let hovered = $state(false);
  let focused = $state(false);
  
  // Combined state for styling
  let active = $derived(hovered || focused);
</script>

<div 
  class="p-6 bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg border border-white/10 dark:border-gray-700/30 
         transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:bg-white/10 dark:hover:bg-gray-800/30 
         shadow-sm hover:shadow-md {active ? 'ring-2 ring-blue-400/30' : ''}"
  onmouseenter={() => hovered = true}
  onmouseleave={() => hovered = false}
  role="article"
>
  <h3 class="text-xl font-semibold mb-3 transition-colors duration-300 {active ? 'text-blue-500 dark:text-blue-300' : 'text-gray-800 dark:text-white'}">
    {title}
  </h3>
  <p class="text-gray-600 dark:text-blue-100 text-base leading-relaxed">
    {description}
  </p>
</div>
