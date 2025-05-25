import { writable } from 'svelte/store';

// Define navigation item type
export interface NavItem {
  title: string;
  href: string;
  icon?: any; // Component type
  isActive?: boolean;
  children?: NavItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

// Create navigation store
function createNavigationStore() {
  const { subscribe, update } = writable<{
    items: NavItem[];
    mobileOpen: boolean;
  }>({
    items: [],
    mobileOpen: false,
  });

  // Toggle mobile menu
  function toggleMobileMenu() {
    update((state) => ({
      ...state,
      mobileOpen: !state.mobileOpen,
    }));
  }

  // Close mobile menu
  function closeMobileMenu() {
    update((state) => ({
      ...state,
      mobileOpen: false,
    }));
  }

  // Set navigation items
  function setItems(items: NavItem[]) {
    update((state) => ({
      ...state,
      items,
    }));
  }

  // Update active state based on current path
  function updateActiveState(path: string) {
    update((state) => {
      const updateItemActiveState = (items: NavItem[]): NavItem[] => {
        return items.map((item) => {
          const isActive = item.href === path;
          const children = item.children ? updateItemActiveState(item.children) : undefined;
          return {
            ...item,
            isActive,
            children,
          };
        });
      };

      return {
        ...state,
        items: updateItemActiveState(state.items),
      };
    });
  }

  return {
    subscribe,
    toggleMobileMenu,
    closeMobileMenu,
    setItems,
    updateActiveState,
  };
}

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
