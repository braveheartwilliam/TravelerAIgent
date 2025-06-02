<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import type { Destination } from '$lib/types/trip';
  import { safeFormatDate, calculateDurationDays } from '$lib/utils/date';
  import { safeString } from '$lib/utils/string';
  
  // Props
  export let destinations: Destination[] = [];
  export let isLoading: boolean = false;
  
  // Events
  let dispatch = createEventDispatcher<{
    add: void;
    edit: { destination: Destination };
    remove: { destination: Destination };
    view: { destination: Destination };
  }>();
  
  import { createEventDispatcher } from 'svelte';
  
  // Methods
  function handleEdit(destination: Destination) {
    dispatch('edit', { destination });
  }
  
  function handleRemove(destination: Destination) {
    dispatch('remove', { destination });
  }
  
  function handleView(destination: Destination) {
    dispatch('view', { destination });
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Destinations</h2>
    <Button class="transition-colors duration-200" on:click={() => dispatch('add')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      Add Destination
    </Button>
  </div>
  
  {#if isLoading}
    <div class="grid gap-4 md:grid-cols-2">
      {#each Array(2) as _, i}
        <Card>
          <CardHeader>
            <div class="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-full mb-4"></div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <div class="h-3 bg-gray-200 rounded animate-pulse w-1/3 mb-1"></div>
                <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
              <div>
                <div class="h-3 bg-gray-200 rounded animate-pulse w-1/3 mb-1"></div>
                <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if destinations.length === 0}
    <div class="text-center py-12 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      <h3 class="text-lg font-medium mb-2">No destinations added yet</h3>
      <p class="text-gray-500 mb-4">Add your first destination to start planning your trip</p>
      <Button variant="outline" on:click={() => dispatch('add')}>
        Add Destination
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      {#each destinations as destination (destination['id'])}
        <Card>
          <CardHeader>
            <CardTitle>{destination['name']}</CardTitle>
            <CardDescription>{safeFormatDate(destination['startDate'])} - {safeFormatDate(destination['endDate'])} • {calculateDurationDays(destination['startDate'], destination['endDate'])} days</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm mb-4">{destination['description']}</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="text-muted-foreground">Address</p>
                <p class="font-medium">{safeString(destination['address'])}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Type</p>
                <p class="font-medium capitalize">{safeString(destination['type']) || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-end gap-2">
            <Button variant="outline" size="sm" on:click={() => handleView(destination)}>View Details</Button>
            <Button variant="outline" size="sm" class="transition-colors duration-200" on:click={() => handleEdit(destination)}>Edit</Button>
            <Button variant="outline" size="sm" class="text-red-500 hover:bg-red-50 transition-colors duration-200" on:click={() => handleRemove(destination)}>Remove</Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>
