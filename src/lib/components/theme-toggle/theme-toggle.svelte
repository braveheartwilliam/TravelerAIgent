<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';

  // Using Svelte 5 runes for reactive state
  let theme = $state<"light" | "dark">("light");

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark");
  }
</script>

<Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
  {#if theme === "light"}
    <svg viewBox="0 0 24 24" width="20" height="20" class="h-5 w-5">
      <path fill="currentColor" d={mdiWeatherSunny} />
    </svg>
    <span class="sr-only">Light mode</span>
  {:else}
    <svg viewBox="0 0 24 24" width="20" height="20" class="h-5 w-5">
      <path fill="currentColor" d={mdiWeatherNight} />
    </svg>
    <span class="sr-only">Dark mode</span>
  {/if}
</Button>
