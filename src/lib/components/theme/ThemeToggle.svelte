<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
  import { Moon, Sun, Monitor } from 'lucide-svelte';
  import { appStore } from '$lib/stores/app';
  import { browser } from '$app/environment';
  
  // Get the current theme from the store
  let currentTheme = $state('system');
  
  // Subscribe to theme changes
  if (browser) {
    $effect(() => {
      const unsubscribe = appStore.subscribe(({ theme }) => {
        currentTheme = theme;
      });
      
      return () => unsubscribe();
    });
  }
  
  // Set the theme
  function setTheme(theme: 'light' | 'dark' | 'system') {
    appStore.update(state => ({
      ...state,
      theme,
    }));
    
    // Save to localStorage
    if (browser) {
      localStorage.setItem('theme', theme);
    }
  }
  
  // Get the current theme icon
  $: themeIcon = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }[currentTheme] || Monitor;
  
  // Get the current theme label
  $: themeLabel = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }[currentTheme] || 'System';
</script>

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Toggle theme">
      <svelte:component this={themeIcon} class="h-5 w-5" />
      <span class="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem on:click={() => setTheme('light')} class="cursor-pointer">
      <Sun class="mr-2 h-4 w-4" />
      <span>Light</span>
    </DropdownMenuItem>
    <DropdownMenuItem on:click={() => setTheme('dark')} class="cursor-pointer">
      <Moon class="mr-2 h-4 w-4" />
      <span>Dark</span>
    </DropdownMenuItem>
    <DropdownMenuItem on:click={() => setTheme('system')} class="cursor-pointer">
      <Monitor class="mr-2 h-4 w-4" />
      <span>System</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
