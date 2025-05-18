<!-- Header.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ThemeToggle } from "$lib/components/theme-toggle";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { page } from "$app/stores";

  async function handleSignIn() {
    try {
      await signIn('github', { 
        callbackUrl: 'http://127.0.0.1:65477',
        redirect: false
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-14 items-center">
    <div class="mr-4 flex">
      <a class="mr-6 flex items-center space-x-2" href="/">
        <span class="font-bold">TravelerAIgent</span>
      </a>
      <nav class="flex items-center space-x-6 text-sm font-medium">
        <a href="/trips" class="transition-colors hover:text-foreground/80">Trips</a>
        <a href="/explore" class="transition-colors hover:text-foreground/80">Explore</a>
        <a href="/community" class="transition-colors hover:text-foreground/80">Community</a>
      </nav>
    </div>
    <div class="flex flex-1 items-center justify-end space-x-2">
      <nav class="flex items-center">
        <ThemeToggle />
        <Button variant="ghost" class="ml-2" on:click={handleSignIn}>Sign In with GitHub</Button>
      </nav>
    </div>
  </div>
</header>
