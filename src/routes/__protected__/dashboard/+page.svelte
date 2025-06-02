<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Breadcrumbs from '$lib/components/dashboard/Breadcrumbs.svelte';
  import FeatureCard from '$lib/components/dashboard/FeatureCard.svelte';
  import ActionButton from '$lib/components/dashboard/ActionButton.svelte';
  import GuidedCreation from '$lib/components/dashboard/GuidedCreation.svelte';
  import LoadingSkeleton from '$lib/components/dashboard/LoadingSkeleton.svelte';
  import Footer from '$lib/components/dashboard/Footer.svelte';
  import './dashboard.css';
  
  // State for UI elements
  let darkMode = $state(false);
  let isLoading = $state(true);
  let showNotification = $state(false);
  
  // Feature data
  const features = [
    {
      title: 'Travel Plans',
      description: 'Create and manage your travel plans with ease.'
    },
    {
      title: 'Travel Memories',
      description: 'Share your travel memories with others.'
    },
    {
      title: 'Traveler Advisor',
      description: 'Get personalized travel advice based on your travel plans.'
    },
    {
      title: 'Stories',
      description: 'Read and write stories about your travel experiences.'
    }
  ];
  
  // Action buttons data
  const createTripIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>`;
  
  const createMemoryIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>`;
  
  // Breadcrumbs data
  const breadcrumbs = [
    { name: 'Home', href: '/dashboard' },
  ];
  
  // Initialize dark mode preference and load data
  onMount(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Initialize dark mode
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        darkMode = savedMode === 'true';
        document.documentElement.classList.toggle('dark', darkMode);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkMode = true;
        document.documentElement.classList.add('dark');
      }
      
      // Simulate loading data
      setTimeout(() => {
        isLoading = false;
        
        // Show notification after content loads
        setTimeout(() => {
          showNotification = true;
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    }
  });
  
  // Dark mode is now handled by the layout
  
  function handleGuidedCreation() {
    console.log('Guided creation started');
    // Will implement guided creation modal
  }
  
  function dismissNotification() {
    showNotification = false;
  }
</script>

<!-- Main Content -->
<main class="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white dashboard-container" aria-labelledby="main-heading">
  <div class="pt-16 pb-12">
    <!-- Top Breadcrumbs -->
    <Breadcrumbs crumbs={breadcrumbs} />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if isLoading}
        <!-- Skeleton Loading State -->
        <LoadingSkeleton />
      {:else}
        <!-- Main Heading -->
        <div 
          class="text-center py-12" 
          in:fly={{ y: 20, duration: 600, delay: 100, easing: cubicOut }}
        >
          <h1 id="main-heading" class="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            <span class="block text-blue-200 text-shadow">Your Travel Plans and</span>
            <span class="block text-white text-shadow">Travel Memories</span>
            <span class="block text-2xl font-normal text-blue-100 mt-4">All in One Place</span>
          </h1>
        </div>

        <!-- Features Description -->
        <div 
          class="max-w-3xl mx-auto text-center mb-16" 
          in:fly={{ y: 20, duration: 600, delay: 300, easing: cubicOut }}
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-100">
            {#each features as feature, i}
              <div in:fly={{ y: 20, duration: 400, delay: 400 + (i * 100), easing: cubicOut }}>
                <FeatureCard title={feature.title} description={feature.description} />
              </div>
            {/each}
          </div>
        </div>

        <!-- Action Buttons -->
        <div 
          class="flex flex-col sm:flex-row justify-center gap-6 mb-16 max-w-2xl mx-auto"
          in:fly={{ y: 20, duration: 600, delay: 800, easing: cubicOut }}
        >
          <ActionButton 
            href="/trips/new" 
            label="Create Trip" 
            icon={createTripIcon} 
            variant="primary" 
          />
          <ActionButton 
            href="/memories/new" 
            label="Create Memory" 
            icon={createMemoryIcon} 
            variant="secondary" 
          />
        </div>

        <!-- Guided Creation Section -->
        <div in:fly={{ y: 20, duration: 600, delay: 1000, easing: cubicOut }}>
          <GuidedCreation {handleGuidedCreation} />
        </div>
      {/if}
    </div>
    
    <!-- Bottom Breadcrumbs -->
    <div class="mt-12">
      <Breadcrumbs crumbs={breadcrumbs} centered={true} />
    </div>
  </div>
</main>

<!-- Footer -->
<Footer />

<!-- Notification -->
{#if showNotification}
  <div 
    class="fixed bottom-6 right-6 z-50 max-w-sm"
    in:fly={{ x: 20, y: 20, duration: 400, easing: cubicOut }}
    out:fade={{ duration: 300 }}
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-blue-500">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0 text-blue-500">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Welcome to TravelerAIgent</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">Start by creating your first trip or memory.</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onclick={dismissNotification}
              aria-label="Dismiss notification"
            >
              <span class="sr-only">Close</span>
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom styles for better readability */
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color-scheme: light dark;
  }
  
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  /* Improve contrast for better readability */
  :global(.text-blue-100) {
    color: rgba(219, 234, 254, 0.95) !important;
  }
  
  :global(.bg-white\/5) {
    background-color: rgba(255, 255, 255, 0.08);
  }
  
  :global(.bg-white\/10) {
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  /* Improve button readability */
  :global(button, a) {
    font-weight: 500;
    letter-spacing: 0.01em;
  }
</style>
