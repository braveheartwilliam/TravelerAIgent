<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    <div class="flex flex-col space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">Authentication Error</h1>
      <p class="text-sm text-muted-foreground">
        {$page.url.searchParams.get('error') || 'An error occurred during authentication'}
      </p>
    </div>

    <Button variant="outline" href="/auth/signin">
      Try Again
    </Button>
  </div>
</div>
