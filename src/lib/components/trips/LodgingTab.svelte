<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import type { Lodging } from '$lib/types/trip';
  import { formatDateRange } from '$lib/utils/date';
  import { createEventDispatcher } from 'svelte';
  
  // Define ImportedLodging type to handle API data format
  type ImportedLodging = Lodging & {
    id?: string;
    tripId?: string;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    cost?: number;
    description?: string;
    type?: string;
    name?: string;
    address?: string;
  };
  
  // Props with Svelte 5 runes
  let { 
    lodgings = $bindable<ImportedLodging[]>([]), 
    isLoading = $bindable(false) 
  } = $props();
  
  // Events
  const dispatch = createEventDispatcher<{
    add: void;
    edit: { lodging: ImportedLodging };
    remove: { lodging: ImportedLodging };
    view: { lodging: ImportedLodging };
  }>();
  
  // Methods
  function handleEdit(lodging: ImportedLodging) {
    dispatch('edit', { lodging });
  }
  
  function handleRemove(lodging: ImportedLodging) {
    dispatch('remove', { lodging });
  }
  
  function handleView(lodging: ImportedLodging) {
    dispatch('view', { lodging });
  }
  
  // Helper function to safely access properties
  function safeGet(obj: any, key: string, defaultValue: any = ''): any {
    return obj && obj[key] !== undefined ? obj[key] : defaultValue;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Lodging</h2>
    <Button 
      class="transition-colors duration-200" 
      onclick={() => dispatch('add')}
      aria-label="Add new lodging"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      Add Lodging
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
  {:else if lodgings.length === 0}
    <div class="text-center py-12 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      <h3 class="text-lg font-medium mb-2">No lodging added yet</h3>
      <p class="text-gray-500 mb-4">Add accommodations to complete your trip plan</p>
      <Button 
        variant="outline" 
        onclick={() => dispatch('add')}
        aria-label="Add new lodging"
      >
        Add Lodging
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2">
      {#each lodgings as lodging (safeGet(lodging, 'id', ''))}
        <Card>
          <CardHeader>
            <CardTitle class="flex justify-between items-center">
              <span>{safeGet(lodging, 'name', 'Unnamed Lodging')}</span>
              <Badge variant="outline">{safeGet(lodging, 'type', 'Hotel')}</Badge>
            </CardTitle>
            <CardDescription>
              {formatDateRange(lodging.checkInDate, lodging.checkOutDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm mb-4">{safeGet(lodging, 'description', 'No description available')}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-muted-foreground">Location</p>
                <p class="font-medium">{safeGet(lodging, 'address', 'Address not specified')}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Cost</p>
                <p class="font-medium">
                  {#if lodging.cost !== undefined && lodging.cost !== null}
                    ${lodging.cost.toLocaleString()}
                  {:else}
                    Not specified
                  {/if}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onclick={() => handleView(lodging)}
              aria-label="View details for {safeGet(lodging, 'name', 'this lodging')}"
            >
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              class="transition-colors duration-200" 
              onclick={() => handleEdit(lodging)}
              aria-label="Edit {safeGet(lodging, 'name', 'this lodging')}"
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              class="text-red-500 hover:bg-red-50 transition-colors duration-200" 
              onclick={() => handleRemove(lodging)}
              aria-label="Remove {safeGet(lodging, 'name', 'this lodging')}"
            >
              Remove
            </Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>
