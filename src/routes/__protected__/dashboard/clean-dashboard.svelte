<script lang="ts">
  // Import types
  import type { PageData } from './$types';
  
  // Import navigation and page stores
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  // Import UI components
  import { Button } from '$lib/components/ui/button';
  
  // Import icons
  import {
    ArrowRight,
    Bell,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Compass,
    FileText,
    HelpCircle,
    LogOut,
    MapPin,
    Plus,
    Search,
    Settings,
    Sun,
    Moon,
    Menu,
    X,
    Home,
    Briefcase,
    Image as ImageIcon,
    BarChart2
  } from 'lucide-svelte';
  
  // Define User type to match the database schema
  interface User {
    id: string;
    userName: string;
    email: string;
    name?: string;
    fullName?: string;
    image?: string;
    role?: string;
    is_active?: boolean;
  }
  
  // Define NavItem type for navigation
  interface NavItem {
    name: string;
    href: string;
    icon: any;
    current: boolean;
  }
  
  // Define ProfileMenuItem type
  interface ProfileMenuItem {
    name: string;
    href?: string;
    action?: () => void;
  }

  // Get user data from page store with proper type assertion
  const user = $derived(($page.data as PageData)?.user as User | undefined);
  const userName = $derived(user?.userName || user?.name || 'User');
  
  // State for UI elements
  let darkMode = $state(false);
  let showMobileMenu = $state(false);
  let showProfileMenu = $state(false);
  let showSearchModal = $state(false);
  let searchQuery = $state('');
  
  // Navigation items
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
    { name: 'Trips', href: '/trips', icon: Briefcase, current: false },
    { name: 'Memories', href: '/memories', icon: ImageIcon, current: false },
    { name: 'Analytics', href: '/analytics', icon: BarChart2, current: false },
  ];
  
  // Profile menu items
  const profileMenu: ProfileMenuItem[] = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
    { name: 'Sign out', action: handleSignOut },
  ];
  
  // Ensure user data is available
  $effect(() => {
    if (!user) {
      console.warn('No user data available');
      // Redirect to sign-in if no user data
      goto('/auth/signin');
    } else {
      console.log('User loaded:', user);
    }
  });
  
  // Toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(darkMode));
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
  
  // Toggle profile menu
  function toggleProfileMenu() {
    showProfileMenu = !showProfileMenu;
  }
  
  // Toggle search modal
  function toggleSearchModal() {
    showSearchModal = !showSearchModal;
    if (showSearchModal) {
      // Focus search input when modal opens
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }, 100);
    }
  }
  
  // Handle search
  function handleSearch(event: Event) {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    
    console.log('Searching for:', searchQuery);
    showSearchModal = false;
  }
  
  // Handle search input
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
  }
  
  // Handle keyboard events
  function handleKeydown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
  
  // Handle profile item click
  function handleProfileItemClick(item: ProfileMenuItem, event?: Event) {
    event?.preventDefault();
    if (item.action) {
      item.action();
    } else if (item.href) {
      goto(item.href);
    }
  }
  
  // Handle sign out
  async function handleSignOut() {
    try {
      // TODO: Implement sign out logic
      console.log('Signing out...');
      await goto('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  
  // ===== NAVIGATION =====
  const navigation: NavItem[] = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Trips', href: '/trips', icon: Briefcase },
    { name: 'Memories', href: '/memories', icon: ImageIcon },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Stories', href: '/stories', icon: BookOpen },
    { name: 'Traveler Advisor', href: '/advisor', icon: Compass },
    { name: 'Traveler Insights', href: '/insights', icon: BarChart2 },
  ];

  const profileNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
    { name: 'Sign out', href: '#', action: handleSignOut }
  ];

  // ===== LIFECYCLE =====
  // Initialize dark mode from localStorage
  $effect(() => {
    if (typeof window === 'undefined') return;
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== darkMode) {
      darkMode = savedDarkMode;
      document.documentElement.classList.toggle('dark', darkMode);
    }
  });
  
  // Update navigation active state based on current path
  let currentPath = $derived($page.url?.pathname || '/dashboard');
  
  $effect(() => {
    navigation.forEach(item => {
      item.current = item.href === currentPath;
    });
  });

  // ===== USER DATA HANDLING =====
  // Process user data with proper type checking
  function processUserData(data: unknown): UserData | null {
    if (!isUserData(data)) return null;
    
    return {
      id: data.id,
      email: data.email,
      name: data.name || data.userName,
      userName: data.userName,
      fullName: data.fullName || null,
      role: data.role || 'user',
      image: data.image || null,
      is_active: data.is_active ?? true,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }

  // Safe type guard for user data
  function isUserData(data: unknown): data is UserData {
    return !!data && 
      typeof data === 'object' &&
      'id' in data && 
      'email' in data &&
      'userName' in data;
  }

  // Initialize user data from page store
  $effect(() => {
    const userData = $page.data?.user || $page.data?.session?.user;
    
    if (!userData) {
      if (typeof window !== 'undefined') {
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
      return;
    }
    
    const processedUser = processUserData(userData);
    if (processedUser) {
      currentUser = processedUser;
    } else {
      console.error('Failed to process user data');
      currentUser = null;
    }
    
    pageLoading = false;
  });

  // ===== UI FUNCTIONS =====
  function toggleDarkMode() {
    darkMode = !darkMode;
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }
  
  function toggleProfileMenu() {
    showProfileMenu = !showProfileMenu;
  }
  
  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
  
  function toggleSearchModal() {
    showSearchModal = !showSearchModal;
    if (showSearchModal) {
      // Focus search input when modal opens
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  // ===== EVENT HANDLERS =====
  function handleSearch(event: Event) {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    
    // TODO: Implement actual search
    console.log('Searching for:', searchQuery);
    showSearchModal = false;
  }
  
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
  }
  
  function handleKeydown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }

  function handleProfileItemClick(item: { href: string; action?: () => void }, event?: Event) {
    event?.preventDefault();
    if (item.action) {
      item.action();
    } else if (item.href) {
      goto(item.href);
    }
  }

  async function handleSignOut() {
    try {
      // TODO: Implement sign out logic
      console.log('Signing out...');
      await goto('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
</script>

<!-- Main Layout -->
<div class="min-h-screen bg-white dark:bg-gray-900">
  <!-- Navigation Bar -->
  <nav class="bg-white/10 dark:bg-gray-800/80 backdrop-blur-md fixed w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Mobile menu button -->
        <div class="flex md:hidden">
          <button 
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onclick={toggleMobileMenu}
            onkeydown={(e: KeyboardEvent) => handleKeydown(e, toggleMobileMenu)}
            aria-expanded={showMobileMenu}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
          >
            <span class="sr-only">Open main menu</span>
            <Menu class="h-6 w-6" />
          </button>
        </div>

        <!-- Logo and Desktop Navigation -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <a href="/" class="flex items-center">
              <Globe class="h-8 w-8 text-blue-400" />
              <span class="ml-2 text-xl font-bold text-white">TravelSphere</span>
            </a>
          </div>
          <div class="hidden md:ml-10 md:flex md:space-x-4">
            {#each navigation as item}
              <a 
                href={item.href}
                class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/20 {item.current ? 'bg-white/30' : ''}"
              >
                {item.name}
              </a>
            {/each}
          </div>
        </div>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <!-- Search button -->
          <button 
            type="button" 
            class="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            onclick={toggleSearchModal}
            onkeydown={(e: KeyboardEvent) => handleKeydown(e, toggleSearchModal)}
            aria-label="Search"
            aria-expanded={showSearchModal}
          >
            <Search class="h-5 w-5" />
          </button>

          <!-- Dark mode toggle -->
          <button
            type="button"
            class="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            on:click={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {#if darkMode}
              <Sun class="h-5 w-5" />
            {:else}
              <Moon class="h-5 w-5" />
            {/if}
          </button>

          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button 
                type="button" 
                class="max-w-xs bg-white/10 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                id="user-menu" 
                aria-expanded={showProfileMenu}
                on:click={toggleProfileMenu}
                aria-haspopup="true"
              >
                <span class="sr-only">Open user menu</span>
                {#if currentUser?.image}
                  <img 
                    class="h-8 w-8 rounded-full" 
                    src={currentUser.image} 
                    alt={currentUser.name || 'User avatar'}
                  />
                {:else}
                  <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                {/if}
              </button>
            </div>

            {#if showProfileMenu}
              <div 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
                tabindex="-1"
                transition:slide
              >
                {#each profileNavigation as item}
                  {#if item.href}
                    <a 
                      href={item.href}
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabindex="-1"
                      on:click|preventDefault={() => handleProfileItemClick(item, event)}
                    >
                      {item.name}
                    </a>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    {#if showMobileMenu}
      <div class="md:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-md rounded-lg mt-2">
          {#each navigation as item}
            <a 
              href={item.href}
              class="text-white hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium {item.current ? 'bg-white/30' : ''}"
              on:click|preventDefault={() => {
                goto(item.href);
                showMobileMenu = false;
              }}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </nav>

  <!-- Main Content -->
  <main class="pt-16">
    <!-- Page content will go here -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {currentUser?.name || 'Traveler'}!</h1>
      <!-- Add your dashboard content here -->
    </div>
  </main>
</div>

<!-- Search Modal -->
{#if showSearchModal}
  <div 
    class="fixed inset-0 z-50 overflow-y-auto" 
    onclick={(e) => e.target === e.currentTarget && (showSearchModal = false)}
    onkeydown={(e: KeyboardEvent) => e.key === 'Escape' && (showSearchModal = false)}
    role="dialog"
    aria-modal="true"
    aria-label="Search dialog"
    tabindex="-1"
    transition:fade
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div 
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-headline">
              Search TravelSphere
            </h3>
            <div class="mt-2">
              <form on:submit|preventDefault={handleSearch} class="space-y-4" role="search">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search-input"
                    type="search"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Search destinations, trips, memories..."
                    bind:value={searchQuery}
                    oninput={handleSearchInput}
                    aria-label="Search input"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                  />
                </div>
                <div class="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
