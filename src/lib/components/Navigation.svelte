<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  // Define component props
  export let darkMode: boolean = false;
  
  // Define the user role type for better type safety
  type UserRole = 'user' | 'admin' | 'super_admin';
  
  interface SessionUser {
    id: string;
    name?: string;
    email: string;
    role?: UserRole;
    image?: string;
  }

  let isMenuOpen = false;
  let isScrolled = false;
  let isProfileDropdownOpen = false;
  
  const navItems = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Trips', href: '/trips' },
    { name: 'Memories', href: '/memories' },
    { name: 'Map', href: '/map' },
    { name: 'Stories', href: '/stories' },
    { name: 'Traveler Advisor', href: '/advisor' },
    { name: 'Traveler Insights', href: '/insights' },
  ];

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // Event dispatcher for dark mode toggle
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function toggleDarkMode() {
    darkMode = !darkMode;
    dispatch('darkModeToggle', { darkMode });
  }
  
  async function handleSignOut() {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (response.ok) window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
</script>

<header class="fixed w-full z-50 transition-all duration-300 {isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-transparent'}">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo -->
      <div class="flex-shrink-0 flex items-center">
        <a href="/dashboard" class="text-2xl font-bold text-indigo-600">TravelerAIgent</a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        {#each navItems as item}
          <a 
            href={item.href}
            class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
            class:font-semibold={$page.url.pathname === item.href}
          >
            {item.name}
          </a>
        {/each}
      </div>

      <!-- Right side (search + profile) -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="w-40 md:w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Profile dropdown -->
        <div class="relative ml-4">
          <button
            on:click={() => isProfileDropdownOpen = !isProfileDropdownOpen}
            class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="user-menu"
            aria-haspopup="true"
          >
            <span class="sr-only">Open user menu</span>
            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              {$page.data.user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {#if isProfileDropdownOpen}
            <div 
              class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div class="py-1" role="none">
                <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  Your Profile
                </a>
                <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  Settings
                </a>
                {#if $page.data.user?.role && ['admin', 'super_admin'].includes($page.data.user.role)}
                  <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    Admin Dashboard
                  </a>
                {/if}
                <button
                  on:click={handleSignOut}
                  class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="flex items-center md:hidden">
        <button
          on:click={() => isMenuOpen = !isMenuOpen}
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile menu -->
  {#if isMenuOpen}
    <div class="md:hidden bg-white shadow-lg">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {#each navItems as item}
          <a
            href={item.href}
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
          >
            {item.name}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</header>

<!-- Add some padding to account for fixed header -->
<div class="h-16"></div>
