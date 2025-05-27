import { writable, type Writable } from 'svelte/store';

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

// Create a navigation store with Svelte 5
export function createNavigationStore(initialItems: NavItem[] = []) {
  // Create a writable store for the navigation state
  const { subscribe, update } = writable<NavigationState>({
    items: initialItems,
    mobileOpen: false
  });

  // Public API
  return {
    // Subscribe to store changes
    subscribe,
    
    // Getters
    get items() {
      let currentItems: NavItem[] = [];
      subscribe($state => { currentItems = $state.items; })();
      return currentItems;
    },
    
    get isMobileOpen() {
      let isOpen = false;
      subscribe($state => { isOpen = $state.mobileOpen; })();
      return isOpen;
    },

    // Actions
    toggleMobileMenu() {
      update(state => ({
        ...state,
        mobileOpen: !state.mobileOpen
      }));
    },

    closeMobileMenu() {
      update(state => ({
        ...state,
        mobileOpen: false
      }));
    },

    setItems(newItems: NavItem[]) {
      update(state => ({
        ...state,
        items: newItems
      }));
    },

    updateActiveState(path: string) {
      const updateItemActiveState = (items: NavItem[]): NavItem[] => {
        return items.map(item => ({
          ...item,
          isActive: item.href === path,
          children: item.children ? updateItemActiveState(item.children) : undefined
        }));
      };

      update(state => ({
        ...state,
        items: updateItemActiveState(state.items)
      }));
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
