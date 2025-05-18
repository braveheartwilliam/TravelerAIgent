<!-- theme-toggle.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Moon, Sun } from "lucide-svelte";

  let theme: "light" | "dark" = "light";

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark");
  }
</script>

<Button variant="ghost" size="icon" on:click={toggleTheme}>
  {#if theme === "light"}
    <Sun class="h-5 w-5" />
    <span class="sr-only">Light mode</span>
  {:else}
    <Moon class="h-5 w-5" />
    <span class="sr-only">Dark mode</span>
  {/if}
</Button>
