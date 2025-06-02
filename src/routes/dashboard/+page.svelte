<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let isLoading = true;
  let showGuidedModal = false;
  
  onMount(() => {
    if (!$page.data.user) {
      goto('/auth/signin');
    } else {
      isLoading = false;
    }
  });

  function toggleGuidedModal() {
    showGuidedModal = !showGuidedModal;
  }

  function navigateTo(route: string) {
    goto(route);
  }
  
  function handleKeyDown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
</script>

<!-- Main Layout -->
<div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-600 bg-cover bg-center" style="background-image: url('/images/world-map-bg.svg');">
  <!-- Navigation -->
  <Navigation />

  <!-- Main Content -->
  <main class="flex-grow pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4">
          <span class="block">Your Travel Plans and</span>
          <span class="text-blue-200">Travel Memories</span>
        </h1>
        <p class="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
          All in one place. Plan, explore, and relive your adventures with ease.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        {#each [
          {
            title: 'Travel Plans',
            description: 'Create and manage your travel plans with ease.',
            icon: '✈️'
          },
          {
            title: 'Travel Memories',
            description: 'Capture and cherish your travel experiences forever.',
            icon: '📸'
          },
          {
            title: 'Traveler Advisor',
            description: 'Get personalized recommendations for your next adventure.',
            icon: '🧭'
          }
        ] as item}
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white">
            <div class="text-4xl mb-4">{item.icon}</div>
            <h3 class="text-xl font-bold mb-2">{item.title}</h3>
            <p class="text-blue-100">{item.description}</p>
          </div>
        {/each}
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button 
            on:click={() => navigateTo('/trips/new')}
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Trip
          </button>
          <button 
            on:click={() => navigateTo('/memories/new')}
            class="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200"
          >
            Create Memory
          </button>
        </div>

        <!-- Guided Creation -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
          <p class="text-blue-100 mb-4">
            Click the button to start a guided creation of plans for a new trip or the capture of a new memory.
          </p>
          <button
            on:click={toggleGuidedModal}
            class="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Let's Get Started
          </button>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <Footer />

  <!-- Guided Creation Modal -->
  {#if showGuidedModal}
    <div 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      on:click|self={toggleGuidedModal}
      on:keydown={(e: KeyboardEvent) => e.key === 'Escape' && toggleGuidedModal()}
      tabindex="-1"
    >
      <div 
        class="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in"
        role="document"
      >
        <h3 id="modal-title" class="text-xl font-bold text-gray-900 mb-4">
          What would you like to create?
        </h3>
        <div class="space-y-4">
          <button
            on:click={() => navigateTo('/trips/new?guided=true')}
            on:keydown={(e: KeyboardEvent) => handleKeyDown(e, () => navigateTo('/trips/new?guided=true'))}
            class="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            tabindex="0"
          >
            <h4 class="font-medium text-gray-900">Plan a New Trip</h4>
            <p class="text-sm text-gray-500">Get step-by-step guidance to plan your next adventure</p>
          </button>
          <button
            on:click={() => navigateTo('/memories/new?guided=true')}
            on:keydown={(e: KeyboardEvent) => handleKeyDown(e, () => navigateTo('/memories/new?guided=true'))}
            class="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            tabindex="0"
          >
            <h4 class="font-medium text-gray-900">Create a Memory</h4>
            <p class="text-sm text-gray-500">Document and share your travel experiences</p>
          </button>
        </div>
        <div class="mt-6 text-center">
          <button
            on:click={toggleGuidedModal}
            on:keydown={(e: KeyboardEvent) => handleKeyDown(e, toggleGuidedModal)}
            class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            tabindex="0"
            aria-label="Close modal"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Add some global styles for the modal animation -->
<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
</style>
