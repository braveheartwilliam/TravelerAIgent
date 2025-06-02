<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import type { Transportation } from '$lib/types/trip';
  import { safeFormatDate } from '$lib/utils/date';
  import { safeString } from '$lib/utils/string';
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let transportation: Transportation[] = [];
  export let isLoading: boolean = false;
  
  // Events
  let dispatch = createEventDispatcher<{
    add: void;
    edit: { transportation: Transportation };
    remove: { transportation: Transportation };
    view: { transportation: Transportation };
  }>();
  
  // Methods
  function handleEdit(transport: Transportation) {
    dispatch('edit', { transportation: transport });
  }
  
  function handleRemove(transport: Transportation) {
    dispatch('remove', { transportation: transport });
  }
  
  function handleView(transport: Transportation) {
    dispatch('view', { transportation: transport });
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Transportation</h2>
    <Button class="transition-colors duration-200" on:click={() => dispatch('add')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M22 11H2"></path><path d="M16 16h.01"></path><path d="M19 16h.01"></path><path d="M13 16h.01"></path><path d="M16 19h.01"></path><path d="M19 19h.01"></path><path d="M13 19h.01"></path><path d="M16 8h.01"></path><path d="M19 8h.01"></path><path d="M13 8h.01"></path></svg>
      Add Transportation
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
  {:else if transportation.length === 0}
    <div class="text-center py-12 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M22 11H2"></path></svg>
      <h3 class="text-lg font-medium mb-2">No transportation added yet</h3>
      <p class="text-gray-500 mb-4">Add transportation details to plan your trip movements</p>
      <Button variant="outline" on:click={() => dispatch('add')}>
        Add Transportation
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      {#each transportation as transport (transport['id'])}
        <Card>
          <CardHeader>
            <CardTitle>{transport['name']}</CardTitle>
            <CardDescription>{safeFormatDate(transport['startDate'])} - {safeFormatDate(transport['endDate'])} • {transport['durationHours'] || 0} hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm mb-4">{transport['description']}</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="text-muted-foreground">From</p>
                <p class="font-medium">{safeString(transport['startLocation'])}</p>
              </div>
              <div>
                <p class="text-muted-foreground">To</p>
                <p class="font-medium">{safeString(transport['endLocation'])}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Type</p>
                <p class="font-medium capitalize">{safeString(transport['type'])}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Budget</p>
                <p class="font-medium">{transport['budget'] ? `$${transport['budget'].toLocaleString()}` : 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-end gap-2">
            <Button variant="outline" size="sm" on:click={() => handleView(transport)}>View Details</Button>
            <Button variant="outline" size="sm" class="transition-colors duration-200" on:click={() => handleEdit(transport)}>Edit</Button>
            <Button variant="outline" size="sm" class="text-red-500 hover:bg-red-50 transition-colors duration-200" on:click={() => handleRemove(transport)}>Remove</Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>
