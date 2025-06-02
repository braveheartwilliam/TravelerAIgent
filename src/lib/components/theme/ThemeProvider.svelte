<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore } from '$lib/stores/app';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
  
  // Get the current theme from the store and children content
  let { theme, children } = $props<{ 
    theme?: 'light' | 'dark' | 'system',
    children: {
      default: {
        component: ComponentType<SvelteComponent>,
        props: Record<string, any>
      }
    }
  }>();
  
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
    
    // Return empty function for non-browser environment
    return () => {};
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

<!-- Render children using Svelte 5 syntax -->
<div>
  {#if children?.default?.component}
    {@render children.default.component(children.default.props)}
  {/if}
</div>
