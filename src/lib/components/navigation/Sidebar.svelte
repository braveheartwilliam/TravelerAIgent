<script lang="ts">
  import { navigation } from '$lib/stores/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, ChevronRight, Menu } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { appStore } from '$lib/stores/app';
  
  // Use $state for reactive variables in Svelte 5
  let currentPath = $state($page.url.pathname);
  let isOpen = $state($appStore.isSidebarOpen);
  
  // Toggle sidebar
  function toggleSidebar() {
    appStore.toggleSidebar();
  }
  
  // Handle keydown events for accessibility
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  }
  
  // Update state when stores change
  $effect(() => {
    currentPath = $page.url.pathname;
    isOpen = $appStore.isSidebarOpen;
    
    if (currentPath) {
      navigation.updateActiveState(currentPath);
    }
  });
</script>


<aside
  class={cn(
    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
  )}
  aria-label="Sidebar"
>
  <!-- Sidebar header -->
  <div class="flex h-16 items-center justify-between border-b px-4">
    <div class="flex items-center space-x-2">
      <span class="text-lg font-semibold">TravelerAIgent</span>
    </div>
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        onclick={toggleSidebar}
        onkeydown={handleKeydown}
        aria-label="Toggle sidebar"
      >
      <Menu class="h-5 w-5" />
    </Button>
  </div>
  
  <!-- Navigation items -->
  <nav class="flex-1 overflow-y-auto p-4">
    <div class="space-y-1">
      {#each $navigation.items as item (item.href)}
        <a
          href={item.href}
          class={cn(
            'flex items-center rounded-md px-3 py-2 text-sm font-medium',
            item.isActive
              ? 'bg-accent text-accent-foreground'
              : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {#if item.icon}
            <div class="mr-3 h-5 w-5">{item.icon}</div>
          {/if}
          <span>{item.title}</span>
        </a>
      {/each}
    </div>
  </nav>
  
  <!-- Collapse button (desktop) -->
  <div class="hidden border-t p-4 md:block">
    <Button
      variant="ghost"
      size="sm"
      class="w-full justify-start"
      onclick={toggleSidebar}
      onkeydown={handleKeydown}
    >
      {#if isOpen}
        <ChevronLeft class="mr-2 h-4 w-4" />
        <span>Collapse</span>
      {:else}
        <ChevronRight class="mr-2 h-4 w-4" />
      {/if}
    </Button>
  </div>
</aside>

<!-- Overlay for mobile -->
{#if !isOpen}
  <div
    role="button"
    tabindex="0"
    class="fixed inset-0 z-30 h-full w-full cursor-default bg-background/80 backdrop-blur-sm md:hidden"
    onclick={toggleSidebar}
    onkeydown={handleKeydown}
    aria-label="Close sidebar"
  >
    <span class="sr-only">Close sidebar</span>
  </div>
{/if}
