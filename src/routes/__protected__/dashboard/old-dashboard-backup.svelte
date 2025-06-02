<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
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
    User,
    X,
    Sun,
    Moon,
    Menu,
    Map,
    Globe,
    MessageSquare,
    BarChart2,
    Home,
    Briefcase,
    Image as ImageIcon
  } from 'lucide-svelte';
  import { slide, fade } from 'svelte/transition';

  // ===== TYPES =====
  interface UserData {
    id: string | number;
    email: string;
    name?: string;
    userName: string;
    fullName?: string | null;
    role?: 'user' | 'admin' | 'superadmin';
    is_active?: boolean;
    image?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }

  interface NavItem {
    name: string;
    href: string;
    icon?: any;
    current?: boolean;
    roles?: Array<'user' | 'admin' | 'superadmin'>;
  }

  // ===== STATE =====
  let darkMode = $state(false);
  let showSearchModal = $state(false);
  let showGuidedModal = $state(false);
  let searchQuery = $state('');
  let showProfileMenu = $state(false);
  let showMobileMenu = $state(false);
  let hasNewNotifications = $state(true);
  let pageLoading = $state(true);
  let currentUser = $state<UserData | null>(null);
  
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
    { name: 'Sign out', href: '#' }
  ];
  
  // ===== LIFECYCLE =====
  // Initialize dark mode from localStorage
  if (typeof window !== 'undefined') {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== darkMode) {
      darkMode = savedDarkMode;
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }
  
  // Update navigation active state based on current path
  let currentPath = $derived($page.url?.pathname || '/dashboard');
  
  $effect(() => {
    navigation.forEach(item => {
      item.current = item.href === currentPath;
    });
  });
  
  // Process user data from page store
  $effect(() => {
    const userData = $page.data?.user || $page.data?.session?.user;
    
    if (!userData) {
      // No user data found, redirect to sign in
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    
    currentUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.userName,
      userName: userData.userName,
      fullName: userData.fullName || null,
      role: userData.role || 'user',
      image: userData.image || null,
      is_active: userData.is_active ?? true,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString()
    };
    
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
  function handleSearch(e: Event) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // TODO: Implement actual search
    console.log('Searching for:', searchQuery);
    showSearchModal = false;
  }
  
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    // Add debounce if needed
    // searchDebounced(searchQuery);
  }
  
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container') && !target.closest('.search-input')) {
      showSearchModal = false;
    }
  }
  
  async function handleSignOut() {
    try {
      // Call your auth service sign out method
      // await signOut();
      await goto('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  
  // Define the shape of our page data with proper types
  interface PageData {
    user?: UserData;
    session?: {
      user?: UserData;
    };
  }
  
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
      // No user data found, redirect to sign in
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
  }
  
  // Process user data with proper type checking and fallbacks
  function processUserData(data: unknown): UserData | null {
    if (!isUserData(data)) return null;
    
    const now = new Date().toISOString();
    
    return {
      id: data.id,
      email: data.email || '',
      name: data.name || data.userName || '',
      userName: data.userName,
      fullName: 'fullName' in data ? data.fullName : null,
      role: data.role || 'user',
      is_active: 'is_active' in data ? data.is_active : true,
      createdAt: 'createdAt' in data ? data.createdAt : now,
      updatedAt: 'updatedAt' in data ? data.updatedAt : now,
      image: 'image' in data ? data.image : null
    };
  }
  
  // Update user when page data changes
  $effect(() => {
    console.log('Page data changed:', $page.data);
    
    // Try to get user from page data or session
    const userData = $page.data?.user || $page.data?.session?.user;
    
    if (isUserData(userData)) {
      console.log('Processing user data:', userData);
      const processedUser = processUserData(userData);
      
      if (processedUser) {
        currentUser = processedUser;
        console.log('User data set:', currentUser);
      } else {
        console.log('Failed to process user data');
        currentUser = null;
      }
    } else {
      console.log('No valid user data found in page data');
      currentUser = null;
    }
    
    pageLoading = false;
  });
  
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  
  // Check if we need to redirect to sign-in
  $effect(() => {
    if (typeof window !== 'undefined' && !user && !isLoading) {
      console.log('No user found, checking if we need to redirect...');
      const currentPath = window.location.pathname;
      
      if (!currentPath.includes('signin') && !currentPath.includes('auth')) {
        const callbackUrl = encodeURIComponent(currentPath + window.location.search);
        console.log('Redirecting to sign-in from dashboard');
        window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
      }
    }
  });
  
  // Simulate loading data
  $effect(() => {
    const timer = setTimeout(() => {
      isLoading = false;
    }, 1000);
    return () => clearTimeout(timer);
  });
  
  // Toggle dark mode with type safety
  function toggleDarkMode() {
    darkMode = !darkMode;
    try {
      localStorage.setItem('darkMode', String(darkMode));
      document.documentElement.classList.toggle('dark', darkMode);
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  }
  
  // Initialize dark mode from user preference or system preference
  $effect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      darkMode = savedMode === 'true';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      darkMode = true;
    }
    document.documentElement.classList.toggle('dark', darkMode);
  });
  
  // Handle search input with proper Svelte event handling
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    
    if (searchQuery.trim().length > 0) {
      showSearchModal = true;
      // In a real app, you would fetch search results here
      console.log('Searching for:', searchQuery);
    } else {
      showSearchModal = false;
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
  
  // Redirect if no user
  $effect(() => {
    if (!user) {
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    }
  });
  
  // Navigation function with analytics
  function navigateTo(path: string) {
    // Track navigation in analytics
    // trackEvent('navigation', { path });
    goto(path);
  }
  
  // Navigation items with type safety
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Trips', path: '/trips' },
    { name: 'Memories', path: '/memories' },
    { name: 'Discover', path: '/discover' },
  ] as const;
  
  type NavItem = typeof navItems[number];
  
  // Profile menu items with proper dark mode handling
  let profileItems = $state([
    { name: 'Edit Profile', path: '/profile/edit', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & Support', path: '/help', icon: HelpCircle },
    { 
      name: 'Toggle Theme',
      action: toggleDarkMode,
      icon: Sun,
      isTheme: true
    },
    { name: 'Sign out', path: '/auth/signout', icon: LogOut }
  ]);

  // Update theme icon when dark mode changes
  $effect(() => {
    const themeItem = profileItems.find(item => 'isTheme' in item && item.isTheme);
    if (themeItem) {
      themeItem.icon = darkMode ? Sun : Moon;
      themeItem.name = darkMode ? 'Light Mode' : 'Dark Mode';
      // Trigger reactivity by creating a new array
      profileItems = [...profileItems];
    }
  });

  // Features list
  const features = [
    {
      title: 'Travel Plans',
      description: 'Create and manage your travel plans with ease.',
      icon: MapPin
    },
    {
      title: 'Travel Memories',
      description: 'Share your travel memories with others.',
      icon: BookOpen
    },
    {
      title: 'Traveler Advisor',
      description: 'Get personalized travel advice based on your travel plans.',
      icon: Compass
    },
    {
      title: 'Stories',
      description: 'Read and write stories about your travel experiences.',
      icon: FileText
    }
  ];

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', href: '/dashboard', current: true }
  ];

  // Function to toggle profile menu visibility with event handling
  function toggleProfileMenu() {
    event.stopPropagation();
    showProfileMenu = !showProfileMenu;
  }

  // Function to handle navigation with preventDefault
  function handleNavigation(action: string, event: Event) {
    event.preventDefault();
    handleButtonClick(action);
  }
  
  // Function to handle button clicks
  function handleButtonClick(action: string) {
    switch (action) {
      case 'createTrip':
        navigateTo('/trips/new');
        break;
      case 'createMemory':
        navigateTo('/memories/new');
        break;
      case 'guidedCreation':
        navigateTo('/onboarding');
        break;
    }
  }
  // Define types for profile menu items
  interface ProfileMenuItem {
    name: string;
    path?: string;
    action?: () => void;
    isTheme?: boolean;
    icon?: any;
  }

  // Handle profile menu item click with proper TypeScript types
  function handleProfileItemClick(item: ProfileMenuItem, event: Event) {
    event.preventDefault();
    if (item.path) {
      navigateTo(item.path);
    } else if (item.action) {
      item.action();
    }
    showProfileMenu = false;
    showMobileMenu = false;
  }
  
  // Close search modal when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container') && !target.closest('.search-input')) {
      showSearchModal = false;
    }
  }
  
  // Add click outside listener for search modal
  $effect(() => {
    if (showSearchModal) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        return undefined;
      };
    }
    return undefined;
  });
</script>

<!-- Search Modal -->
{#if showSearchModal}
  <div class="fixed inset-0 z-50 overflow-y-auto" on:click|self={() => showSearchModal = false}>
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" transition:fade></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div 
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-headline"
        transition:fly={{ y: -20, duration: 200 }}
      >
        <div class="relative">
          <button 
            type="button" 
            class="absolute top-0 right-0 text-gray-400 hover:text-gray-500"
            on:click={() => showSearchModal = false}
          >
            <X class="h-6 w-6" />
          </button>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-headline">
              Search
            </h3>
            <div class="mt-4">
              <form on:submit|preventDefault={handleSearch}>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search..."
                    bind:value={searchQuery}
                    autofocus
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
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true"></div>
      
      <!-- Modal content -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full search-container">
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Search Results for "{searchQuery}"
          </h3>
          <div class="mt-2">
            {#if searchQuery.length > 0}
              <div class="space-y-2">
                <!-- Sample search results -->
                <div class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                  <div class="flex items-center">
                    <Compass class="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Trip to {searchQuery}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Upcoming trip • 5 days</p>
                    </div>
                  </div>
                </div>
                <div class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                  <div class="flex items-center">
                    <FileText class="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Memory: {searchQuery} Adventure</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Added 2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            {:else}
              <p class="text-sm text-gray-500 dark:text-gray-300">
                Type to search for trips, memories, and destinations...
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<svelte:head>
  <title>Dashboard | TravelerAIgent</title>
  <meta name="description" content="Your personal travel dashboard - Plan trips, capture memories, and explore the world" />
</svelte:head>

  <!-- Navigation Bar -->
  <nav class="bg-white/10 dark:bg-gray-800/80 backdrop-blur-md fixed w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Mobile menu button -->
        <div class="flex md:hidden">
          <button 
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            on:click={toggleMobileMenu}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu"
          >
            <span class="sr-only">Open main menu</span>
            <Menu class={`block h-6 w-6 transition-transform ${showMobileMenu ? 'transform rotate-90' : ''}`} />
          </button>
        </div>

        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="/dashboard" class="flex items-center" aria-label="TravelerAIgent Home">
            <span class="text-white text-xl font-bold">TravelerAIgent</span>
          </a>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <a 
            href="/dashboard" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              text-white hover:bg-white/20 
              {currentPath === '/dashboard' ? 'bg-white/10' : ''}"
            aria-current={currentPath === '/dashboard' ? 'page' : undefined}
          >
            Dashboard
          </a>
          <a 
            href="/trips" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              text-white hover:bg-white/20 
              {currentPath.startsWith('/trips') ? 'bg-white/10' : ''}"
            aria-current={currentPath.startsWith('/trips') ? 'page' : undefined}
          >
            Trips
          </a>
          <a 
            href="/destinations" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              text-white hover:bg-white/20 
              {currentPath.startsWith('/destinations') ? 'bg-white/10' : ''}"
            aria-current={currentPath.startsWith('/destinations') ? 'page' : undefined}
          >
            Destinations
          </a>
          <a 
            href="/activities" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
              text-white hover:bg-white/20 
              {currentPath.startsWith('/activities') ? 'bg-white/10' : ''}"
            aria-current={currentPath.startsWith('/activities') ? 'page' : undefined}
          >
            Activities
          </a>
        </div>
        
        <!-- Right side controls -->
        <div class="flex items-center space-x-2">
          <!-- Search button -->
          <button 
            type="button" 
            class="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            on:click={toggleSearchModal}
            aria-label="Search"
            aria-expanded={showSearchModal}
            aria-controls="search-modal"
          >
            <Search class="h-5 w-5" />
          </button>
          
          <!-- Search Modal -->
          {#if showSearchModal}
            <div 
              class="fixed inset-0 z-50 overflow-y-auto" 
              on:click|self={() => showSearchModal = false}
              on:keydown={(e) => e.key === 'Escape' && (showSearchModal = false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-modal-title"
              id="search-modal"
            >
              <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="search-input"
                      type="text"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search..."
                      bind:value={searchQuery}
                      on:input={handleSearchInput}
                      on:keydown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                    <button
                      type="button"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                      on:click={() => showSearchModal = false}
                    >
                      <X class="h-5 w-5" />
                      <span class="sr-only">Close search</span>
                    </button>
                  </div>
                  
                  {#if searchQuery}
                    <div class="mt-4">
                      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Search results for "{searchQuery}"</h3>
                      {#if searchResults.length > 0}
                        <div class="space-y-2">
                          {#each searchResults as result}
                            <a 
                              href={result.href} 
                              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              on:click|preventDefault={() => {
                                showSearchModal = false;
                                goto(result.href);
                              }}
                            >
                              {result.title}
                            </a>
                          {/each}
                        </div>
                      {:else}
                        <p class="text-sm text-gray-500 dark:text-gray-400">No results found</p>
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
          
          <!-- Notifications -->
          <button 
            type="button" 
            class="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            aria-label="Notifications"
            onclick={() => hasNewNotifications = false}
          >
            <span class="sr-only">View notifications</span>
            <div class="relative">
              <Bell class="h-6 w-6" />
              {#if hasNewNotifications}
                <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white">
                  <span class="sr-only">New notifications</span>
                </span>
              {/if}
            </div>
          </button>
          
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button 
                type="button" 
                class="max-w-xs bg-white/10 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                id="user-menu" 
                aria-expanded="false" 
                aria-haspopup="true"
                onclick={toggleProfileMenu}
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  {user?.userName?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
            </div>
            
            <!-- Profile dropdown menu -->
            {#if showProfileMenu}
              <div 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu" 
                aria-orientation="vertical" 
                aria-labelledby="user-menu"
                tabindex="-1"
              >
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName || user?.userName || 'User'}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                
                {#each profileItems as item}
                  {#if item.path}
                    <a 
                      href={item.path}
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabindex="-1"
                      onclick={(e) => {
                        e.preventDefault();
                        handleProfileItemClick(item, e);
                      }}
                    >
                      <div class="flex items-center">
                        <item.icon class="mr-3 h-5 w-5 text-gray-400" />
                        {item.name}
                      </div>
                    </a>
                  {:else if item.action}
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onclick={(e) => {
                        e.preventDefault();
                        item.action();
                      }}
                      role="menuitem"
                      tabindex="-1"
                    >
                      <item.icon class="mr-3 h-5 w-5 text-gray-400" />
                      {item.name}
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="-mr-2 flex md:hidden">
          <button 
            type="button" 
            class="bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onclick={toggleMobileMenu}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu"
          >
            <span class="sr-only">{showMobileMenu ? 'Close' : 'Open'} main menu</span>
            <svg 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              {#if showMobileMenu}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              {/if}
            </svg>
          </button>
        </div>
        <!-- Mobile menu, show/hide based on menu state. -->
        {#if showMobileMenu}
          <div class="md:hidden" id="mobile-menu">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-md rounded-lg mt-2">
              {#each navItems as item}
                <a 
                  href={item.path}
                  class="text-white hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium {currentPath === item.path ? 'bg-white/30' : ''}"
                  onclick={(e) => {
                    e.preventDefault();
                    navigateTo(item.path);
                    showMobileMenu = false;
                  }}
                >
                  {item.name}
                </a>
              {/each}
            </div>
          </div>
        {/if}
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            {#each navItems as item}
              <a 
                href={item.path} 
                class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/20 {$page.url.pathname === item.path ? 'bg-white/30' : ''}"
              >
                {item.name}
              </a>
            {/each}
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <div class="ml-3 relative">
              <div>
                <button 
                  type="button" 
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                  id="user-menu" 
                  aria-expanded="false" 
                  aria-haspopup="true"
                  onclick={toggleProfileMenu}
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    {#if user?.name?.[0]}
                      {@const initial = user.name[0].toUpperCase()}
                      {#if initial}
                        {initial}
                      {:else}
                        <User class="h-5 w-5" />
                      {/if}
                    {:else}
                      <User class="h-5 w-5" />
                    {/if}
                  </div>
                </button>
              </div>
              {#if showProfileMenu}
                <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  {#each profileItems as item}
                    <a 
                      href={item.path} 
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <item.icon class="mr-3 h-5 w-5 text-gray-500" />
                      {item.name}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <button 
            type="button" 
            class="bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white" 
            aria-controls="mobile-menu" 
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="flex-grow pt-16 bg-gradient-to-b from-blue-900 to-blue-600 text-white min-h-screen">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16 text-center">
      <!-- Section 1: Main Heading -->
      <div class="max-w-4xl mx-auto mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          <span class="text-white">Your Travel Plans and Travel Memories</span>
          <br>
          <span class="bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">All in One Place</span>
        </h1>
      </div>

      <!-- Section 2: Features Overview -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-3">Travel Plans</h3>
            <p class="text-blue-100">Create and manage your travel plans with ease.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-3">Travel Memories</h3>
            <p class="text-blue-100">Share your travel memories with others.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-3">Traveler Advisor</h3>
            <p class="text-blue-100">Get personalized travel advice based on your plans.</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-3">Stories</h3>
            <p class="text-blue-100">Read and write stories about your travel experiences.</p>
          </div>
        </div>
        
        <p class="text-xl mb-8 text-blue-100">
          Plan and manage your trips with ease and capture and organize your travel memories.
        </p>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Button size="lg" class="bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium px-8 py-6 rounded-xl transition-all transform hover:scale-105">
            <Plus class="mr-2 h-5 w-5" /> Create Trip
          </Button>
          <Button size="lg" variant="outline" class="border-2 border-white text-white hover:bg-white/10 text-lg font-medium px-8 py-6 rounded-xl transition-all transform hover:scale-105">
            <ImageIcon class="mr-2 h-5 w-5" /> Create Memory
          </Button>
        </div>
      </div>

      <!-- Section 3: Guided Creation -->
      <div class="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <h2 class="text-2xl md:text-3xl font-bold mb-6">New to TravelerAIgent?</h2>
        <p class="text-lg text-blue-100 mb-8">
          Click the button to start a guided creation of plans for a new trip or the capture of a new memory.
        </p>
        <Button 
          size="lg" 
          class="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white text-lg font-medium px-8 py-6 rounded-xl transition-all transform hover:scale-105"
          on:click={() => showGuidedModal = true}
        >
          Let's Get Started
          <ArrowRight class="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>

    <!-- Breadcrumbs -->
    <div class="container mx-auto px-4 py-4 text-sm text-blue-200">
      <div class="flex items-center space-x-2">
        <a href="/dashboard" class="hover:text-white transition-colors">Home</a>
        <ChevronRight class="h-4 w-4" />
        <span class="text-white font-medium">Dashboard</span>
      </div>
    </div>
  </main>

  <!-- Guided Creation Modal -->
  {#if showGuidedModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click|self={() => showGuidedModal = false}>
      <div 
        class="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300"
        transition:slide
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What would you like to create?</h3>
          <button 
            type="button" 
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            on:click={() => showGuidedModal = false}
          >
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6 mt-8">
          <div 
            class="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            on:click={() => {
              showGuidedModal = false;
              goto('/trips/new');
            }}
          >
            <div class="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 class="text-lg font-semibold mb-2">New Trip</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Plan your next adventure with our guided trip creator</p>
          </div>
          
          <div 
            class="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            on:click={() => {
              showGuidedModal = false;
              goto('/memories/new');
            }}
          >
            <div class="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon class="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 class="text-lg font-semibold mb-2">New Memory</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Capture and organize your travel moments</p>
          </div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-center text-gray-500 dark:text-gray-400">
            Not sure where to start? <a href="/help" class="text-blue-600 dark:text-blue-400 hover:underline">Get help</a>
          </p>
        </div>
      </div>
    </div>
  {/if}
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-30">
        <img 
          src="/images/world-map-bg.svg" 
          alt="World map background"
          class="w-full h-full object-cover"
        />
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6">
            <span class="block">Your Travel Plans and</span>
            <span class="block text-blue-200">Travel Memories</span>
            <span class="block">All in One Place</span>
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
            Plan and manage your trips with ease and capture and organize your travel memories.
          </p>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex mb-8" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            {#each breadcrumbs as item, i (i)}
              <li class="flex items-center">
                {#if i > 0}
                  <ChevronRight class="flex-shrink-0 h-5 w-5 text-gray-400" />
                {/if}
                <a 
                  href={item.href}
                  class="text-sm font-medium text-gray-500 hover:text-gray-700 {item.current ? 'font-bold' : ''}"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              </li>
            {/each}
          </ol>
        </nav>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {#each features as feature}
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                <feature.icon class="h-6 w-6 text-blue-500" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p class="text-gray-600">{feature.description}</p>
            </div>
          {/each}
        </div>

        <!-- Call to Action Buttons -->
        <div class="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onclick={(event: MouseEvent) => handleNavigation('createTrip', event)}
            class="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus class="-ml-1 mr-2 h-5 w-5" />
            Create Trip
          </Button>
          <Button 
            onclick={(event: MouseEvent) => handleNavigation('createMemory', event)}
            variant="outline"
            class="w-full sm:w-auto px-8 py-3 text-base font-medium text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus class="-ml-1 mr-2 h-5 w-5" />
            Create Memory
          </Button>
        </div>
      </div>
    </div>
  </main>
  
  <!-- Guided Creation Section -->
  <div class="bg-white py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-blue-50 rounded-2xl px-6 py-16 sm:p-12 lg:flex lg:items-center lg:justify-between">
        <div class="lg:w-0 lg:flex-1">
          <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Need help getting started?
          </h2>
          <p class="mt-4 max-w-3xl text-lg text-gray-500">
            Click the button to start a guided creation of plans for a new trip or the capture of a new memory.
          </p>
        </div>
        <div class="mt-8 flex lg:mt-0 lg:ml-8">
          <Button 
            onclick={(event: MouseEvent) => handleNavigation('guidedCreation', event)}
            size="lg"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
          >
            Let's Get Started
            <ChevronRight class="ml-2 -mr-1 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
