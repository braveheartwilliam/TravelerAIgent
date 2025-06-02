<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  // Accept the handleGuidedCreation prop using Svelte 5 runes
  const { handleGuidedCreation = null } = $props<{
    handleGuidedCreation?: (() => void) | null;
  }>();
  
  const dispatch = createEventDispatcher<{
    startGuided: void;
  }>();
  
  // Handle the guided creation button click
  function handleStartGuided() {
    // If a handler was provided as a prop, call it
    if (handleGuidedCreation) {
      handleGuidedCreation();
    }
    // Also dispatch the event for backward compatibility
    dispatch('startGuided');
  }
  
  // Animation and interaction states
  let hovered = $state(false);
  let focused = $state(false);
  
  // Combined state for styling
  let active = $derived(hovered || focused);
</script>

<div 
  class="max-w-2xl mx-auto text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-md transition-all duration-300 {hovered ? 'bg-white/15' : ''}"
  onmouseenter={() => hovered = true}
  onmouseleave={() => hovered = false}
  role="region"
  aria-labelledby="guided-creation-heading"
>
  <h2 id="guided-creation-heading" class="text-xl font-bold text-white mb-3">Need Help Getting Started?</h2>
  <p class="text-blue-100 mb-4 text-base leading-relaxed max-w-xl mx-auto">
    Click the button below to start a guided creation of plans for a new trip or the capture of a new memory.
  </p>
  <div class="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 dark:from-purple-800/40 dark:to-indigo-800/40 
            rounded-lg p-6 border border-purple-500/20 dark:border-purple-600/20 shadow-lg">
    <h3 class="text-xl font-semibold text-white mb-3">Not sure where to start?</h3>
    <p class="text-blue-100 mb-4">Let our AI guide you through creating your perfect trip step by step.</p>
    <button 
      onclick={handleStartGuided}
      class="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
             text-white rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 
             focus:ring-offset-2 focus:ring-offset-blue-900 {active ? 'shadow-md scale-[1.02]' : 'shadow-sm'}"
      onmouseenter={() => hovered = true}
      onmouseleave={() => hovered = false}
      onfocus={() => focused = true}
      onblur={() => focused = false}
    >
      Start Guided Creation
    </button>
  </div>
</div>
