import { browser } from '$app/environment';
import { appStore } from '$lib/stores/app';
import { get } from 'svelte/store';
import type { HandleClientError } from '@sveltejs/kit';

// Initialize client-side logic
if (browser) {
  // Apply theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme: 'light' | 'dark' | 'system' = 'system';
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme = savedTheme as 'light' | 'dark';
  } else if (prefersDark) {
    theme = 'dark';
  }
  
  // Apply the theme
  document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark));
  
  // Initialize app store with theme
  appStore.update(store => ({
    ...store,
    theme,
  }));
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleThemeChange = (e: MediaQueryListEvent) => {
    const currentTheme = get(appStore);
    if (currentTheme.theme === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  };
  
  mediaQuery.addEventListener('change', handleThemeChange);
  
  // Cleanup
  window.addEventListener('beforeunload', () => {
    mediaQuery.removeEventListener('change', handleThemeChange);
  });
}

// Global error handler
export const handleError: HandleClientError = ({ error }) => {
  console.error('Client error:', error);
  
  // You can add error reporting here (e.g., Sentry, LogRocket)
  
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
  };
};
