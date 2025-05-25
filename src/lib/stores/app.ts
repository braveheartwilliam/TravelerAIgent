import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Theme type
type Theme = 'light' | 'dark' | 'system';

// App state interface
interface AppState {
  theme: Theme;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

// Default state
const initialState: AppState = {
  theme: 'system',
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isLoading: false,
  error: null,
};

// Create a custom store with Svelte 5 runes
function createAppStore() {
  const { subscribe, set, update } = writable<AppState>(initialState);

  // Load theme from localStorage on client-side
  if (browser) {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      update(state => ({
        ...state,
        theme: savedTheme,
      }));
      applyTheme(savedTheme);
    } else {
      // Default to system preference
      update(state => ({
        ...state,
        theme: 'system',
      }));
      applyTheme('system');
    }
  }

  // Apply theme class to document
  function applyTheme(theme: Theme) {
    if (!browser) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return systemTheme;
    } else {
      root.classList.add(theme);
      return theme;
    }
  }

  // Toggle theme
  function toggleTheme() {
    update(state => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (browser) {
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      }
      return { ...state, theme: newTheme };
    });
  }

  // Toggle sidebar
  function toggleSidebar() {
    update(state => ({
      ...state,
      isSidebarOpen: !state.isSidebarOpen,
    }));
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    update(state => ({
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  }

  // Set loading state
  function setLoading(isLoading: boolean) {
    update(state => ({
      ...state,
      isLoading,
    }));
  }

  // Set error
  function setError(error: string | null) {
    update(state => ({
      ...state,
      error,
    }));
  }

  // Reset to initial state
  function reset() {
    set(initialState);
    if (browser) {
      localStorage.removeItem('theme');
      applyTheme('system');
    }
  }

  return {
    subscribe,
    set,
    update,
    toggleTheme,
    toggleSidebar,
    toggleMobileMenu,
    setLoading,
    setError,
    reset,
  };
}

export const appStore = createAppStore();

// Listen for system theme changes
if (browser) {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    });
}
