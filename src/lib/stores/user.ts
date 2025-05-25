import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/auth/session';

// Initialize the user store with the user from the server-side
function createUserStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  // Only run this code in the browser
  if (browser) {
    // Try to get the user from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        set(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('user');
      }
    }
  }

  return {
    subscribe,
    set: (user: User | null) => {
      if (browser) {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
      set(user);
    },
    update,
    // Helper method to update specific user properties
    updateUser: (updates: Partial<User>) => {
      update(currentUser => {
        if (!currentUser) return currentUser;
        const updatedUser = { ...currentUser, ...updates };
        if (browser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return updatedUser;
      });
    },
    // Clear the user (on sign out)
    clear: () => {
      if (browser) {
        localStorage.removeItem('user');
      }
      set(null);
    }
  };
}

export const userStore = createUserStore();

// Helper function to check if the user is authenticated
export const isAuthenticated = {
  subscribe: (run: (value: boolean) => void) => {
    return userStore.subscribe(user => run(!!user?.id));
  }
};

// Helper function to get the user's role
export const userRole = {
  subscribe: (run: (value: string | null) => void) => {
    return userStore.subscribe(user => run(user?.role || null));
  }
};

// Helper function to check if the user has a specific role
export function hasRole(role: string) {
  return {
    subscribe: (run: (value: boolean) => void) => {
      return userStore.subscribe(user => run(user?.role === role));
    }
  };
}

// Helper function to check if the user has any of the specified roles
export function hasAnyRole(roles: string[]) {
  return {
    subscribe: (run: (value: boolean) => void) => {
      return userStore.subscribe(user => 
        run(!!user?.role && roles.includes(user.role))
      );
    }
  };
}

// Sync the user store with the page data when it changes
if (browser) {
  import('$app/stores').then(({ page }) => {
    page.subscribe(($page) => {
      const user = $page.data.user as User | undefined;
      if (user) {
        userStore.set(user);
      }
    });
  });
}
