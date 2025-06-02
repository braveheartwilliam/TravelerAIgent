<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import type { Activity } from '$lib/types/trip';
  import { formatDateRange } from '$lib/utils/date';
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let activities: Activity[] = [];
  export let isLoading: boolean = false;
  
  // Events
  let dispatch = createEventDispatcher<{
    add: void;
    edit: { activity: Activity };
    remove: { activity: Activity };
    view: { activity: Activity };
  }>();
  
  // Methods
  function handleEdit(activity: Activity) {
    dispatch('edit', { activity });
  }
  
  function handleRemove(activity: Activity) {
    dispatch('remove', { activity });
  }
  
  function handleView(activity: Activity) {
    dispatch('view', { activity });
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Activities</h2>
    <Button class="transition-colors duration-200" on:click={() => dispatch('add')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      Add Activity
    </Button>
  </div>
  
  {#if isLoading}
    <div class="grid gap-4 md:grid-cols-2">
      {#each Array(2) as _, i}
        <Card>
          <CardHeader>
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div class="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/3 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-full mb-4"></div>
            <div class="grid grid-cols-2 gap-4">
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
  {:else if activities.length === 0}
    <div class="text-center py-12 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <h3 class="text-lg font-medium mb-2">No activities added yet</h3>
      <p class="text-gray-500 mb-4">Add activities to make your trip more exciting</p>
      <Button variant="outline" on:click={() => dispatch('add')}>
        Add Activity
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      {#each activities as activity (activity['id'])}
        <Card>
          <CardHeader>
            <CardTitle class="flex justify-between items-center">
              <span>{activity['name']}</span>
              <Badge variant="outline">{activity['type']}</Badge>
            </CardTitle>
            <CardDescription>
              {formatDateRange(activity['startDate'], activity['endDate'])}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm mb-4">{activity['description']}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-muted-foreground">Location</p>
                <p class="font-medium">{activity['location']}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Budget</p>
                <p class="font-medium">${activity['budget']?.toLocaleString() || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-end gap-2">
            <Button variant="outline" size="sm" on:click={() => handleView(activity)}>View Details</Button>
            <Button variant="outline" size="sm" class="transition-colors duration-200" on:click={() => handleEdit(activity)}>Edit</Button>
            <Button variant="outline" size="sm" class="text-red-500 hover:bg-red-50 transition-colors duration-200" on:click={() => handleRemove(activity)}>Remove</Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>
