<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore } from '$lib/stores/app';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  // Get the current theme from the store
  let { theme } = $props<{ theme?: 'light' | 'dark' | 'system' }>();
  
  // Initialize theme
  onMount(() => {
    if (browser) {
      // Apply the initial theme
      applyTheme(theme || 'system');
      
      // Listen for theme changes
      const unsubscribe = appStore.subscribe(({ theme: currentTheme }) => {
        applyTheme(currentTheme);
      });
      
      return () => unsubscribe();
    }
  });
  
  // Apply theme to the document
  function applyTheme(theme: 'light' | 'dark' | 'system') {
    if (!browser) return;
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }
</script>

<slot />
