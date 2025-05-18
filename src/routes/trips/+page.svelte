<!-- src/routes/trips/+page.svelte -->
<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="container py-8">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">My Trips</h1>
      <p class="text-muted-foreground">Welcome back, {data.user.name}!</p>
    </div>
    <Button variant="ghost" on:click={() => signOut()}>Sign Out</Button>
  </div>

  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Create New Trip</CardTitle>
        <CardDescription>Start planning your next adventure</CardDescription>
      </CardHeader>
      <CardContent>
        <Button class="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          New Trip
        </Button>
      </CardContent>
    </Card>
  </div>
</div>
