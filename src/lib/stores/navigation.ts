// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: any; // Svelte component
  isActive?: boolean;
  children?: NavItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

// Navigation state type
interface NavigationState {
  items: NavItem[];
  mobileOpen: boolean;
}

// Create a navigation store with Svelte 5 runes
export function createNavigationStore(initialItems: NavItem[] = []) {
  // Use $state for reactive state
  const state = $state<NavigationState>({
    items: initialItems,
    mobileOpen: false
  });

  // Public API
  return {
    // Getters
    get items() {
      return state.items;
    },
    
    get isMobileOpen() {
      return state.mobileOpen;
    },

    // Actions
    toggleMobileMenu() {
      state.mobileOpen = !state.mobileOpen;
    },

    closeMobileMenu() {
      state.mobileOpen = false;
    },

    setItems(newItems: NavItem[]) {
      state.items = newItems;
    },

    updateActiveState(path: string) {
      const updateItemActiveState = (items: NavItem[]): NavItem[] => {
        return items.map(item => ({
          ...item,
          isActive: item.href === path,
          children: item.children ? updateItemActiveState(item.children) : undefined
        }));
      };

      state.items = updateItemActiveState(state.items);
    }
  };
}

// Create and export default navigation instance
export const navigation = createNavigationStore();

// Initialize with default navigation items
export const defaultNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: 'LayoutDashboard',
    requiresAuth: true,
  },
  {
    title: 'Trips',
    href: '/app/trips',
    icon: 'Map',
    requiresAuth: true,
  },
  {
    title: 'Itinerary',
    href: '/app/itinerary',
    icon: 'Calendar',
    requiresAuth: true,
  },
  {
    title: 'Explore',
    href: '/app/explore',
    icon: 'Compass',
    requiresAuth: true,
  },
  {
    title: 'Saved',
    href: '/app/saved',
    icon: 'Bookmark',
    requiresAuth: true,
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: 'Settings',
    requiresAuth: true,
    children: [
      {
        title: 'Profile',
        href: '/app/settings/profile',
      },
      {
        title: 'Account',
        href: '/app/settings/account',
      },
      {
        title: 'Appearance',
        href: '/app/settings/appearance',
      },
      {
        title: 'Notifications',
        href: '/app/settings/notifications',
      },
    ],
  },
];
