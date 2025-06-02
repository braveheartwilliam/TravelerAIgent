<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Define user type
  type UserRole = 'user' | 'admin' | 'super_admin';
  
  type User = {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    image?: string;
  } | null;
  
  // Get props with proper typing
  const props = $props<{
    user?: User | null;
    darkMode?: boolean;
    handleSignOut?: () => Promise<void>;
  }>();
  
  // Default handleSignOut implementation
  const handleSignOut = $derived(
    props.handleSignOut ||
    (async () => {
      try {
        const response = await fetch('/api/auth/signout', { method: 'POST' });
        if (response.ok && browser) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Sign out error:', error);
      }
    })
  );
  
  // Get user from props or page data with proper null checking
  const user = $derived(props.user || $page.data?.user || null);
  
  // State variables
  let isMenuOpen = $state(false);
  let isScrolled = $state(false);
  let isProfileDropdownOpen = $state(false);
  
  // Navigation items based on spec
  const navItems = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Trips', href: '/trips' },
    { name: 'Memories', href: '/memories' },
    { name: 'Map', href: '/map' },
    { name: 'Stories', href: '/stories' },
    { name: 'Traveler Advisor', href: '/advisor' },
    { name: 'Traveler Insights', href: '/insights' },
  ];
  
  // Handle scroll events for transparent/solid header
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  // Toggle profile dropdown
  function toggleProfileDropdown() {
    isProfileDropdownOpen = !isProfileDropdownOpen;
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Get user initials for avatar
  function getUserInitials(name: string | null): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
</script>

<header class="fixed w-full z-50 transition-all duration-300 {isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md border-b border-gray-200/50 dark:border-gray-800/50' : 'bg-transparent'}">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo -->
      <div class="flex-shrink-0 flex items-center">
        <a href="/dashboard" class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-300 hover:opacity-90 transition-opacity">TravelerAIgent</a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center">
        {#each navItems as item, i}
          <a 
            href={item.href}
            class="mx-4 px-6 py-3 text-lg font-semibold transition-all duration-200 rounded-lg
                  text-white 
                  hover:text-yellow-200 
                  hover:bg-blue-700/70 
                  focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2
                  {$page.url.pathname === item.href ? 'bg-blue-700/90 shadow-lg' : ''}"
            tabindex="0"
          >
            {item.name}
          </a>
          {#if i < navItems.length - 1}
            <span class="h-5 w-px bg-blue-200/60"></span>
          {/if}
        {/each}
      </div>

      <!-- Right side (search + profile) -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="w-40 md:w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Profile dropdown -->
        <div class="relative ml-4">
          <button
            onclick={toggleProfileDropdown}
            class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="user-menu"
            aria-haspopup="true"
          >
            <span class="sr-only">Open user menu</span>
            <div class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
              {getUserInitials(user?.name || null)}
            </div>
          </button>

          {#if isProfileDropdownOpen}
            <div 
              class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div class="py-1" role="none">
                <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                  Edit Profile
                </a>
                <a href="/profile/change-password" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                  Change Password
                </a>
                {#if user?.role && ['admin', 'super_admin'].includes(user.role)}
                  <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                    Admin Dashboard
                  </a>
                {/if}
                <button
                  onclick={handleSignOut}
                  class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          onclick={toggleMobileMenu}
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="h-6 w-6"
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
    <div class="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div class="px-3 pt-3 pb-4 divide-y divide-gray-200 dark:divide-gray-700">
        {#each navItems as item}
        <a
          href={item.href}
          class="block px-6 py-4 mb-2 rounded-lg text-lg font-semibold transition-all duration-200
                text-white 
                hover:text-yellow-200 
                hover:bg-blue-700/70
                focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2
                {$page.url.pathname === item.href ? 'bg-blue-700/90 shadow-lg' : ''}"
          tabindex="0"
        >
          {item.name}
        </a>
      {/each}
      </div>
    </div>
  {/if}
</header>

<!-- Add padding to account for fixed header -->
<div class="h-16"></div>
