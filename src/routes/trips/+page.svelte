<!-- src/routes/trips/+page.svelte -->
<script lang="ts">
  import { signOut } from '$lib/auth/auth';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { Separator } from '$lib/components/ui/separator';
  import TripCard from '$lib/components/trips/TripCard.svelte';
  import TripFilters from '$lib/components/trips/TripFilters.svelte';
  import CreateTripDialog from '$lib/components/trips/CreateTripDialog.svelte';
  import type { PageData } from './$types';
  import type { TripSummary, TripStatus, TripType } from '$lib/types/trip';

  // Import page data
  const { user, trips = [], error } = $props();

  // State
  let searchQuery = $state<string>('');
  let selectedStatus = $state<TripStatus | ''>('');
  let selectedType = $state<TripType | ''>('');
  let sortBy = $state<string>('date-desc');
  let activeTab = $state<string>('all');
  let createDialogOpen = $state<boolean>(false);

  // Process trips data with filtering and sorting
  function processTrips() {
    // Ensure trips is an array
    let result = Array.isArray(trips) ? [...trips] : [];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((trip: any) => 
        trip.title?.toLowerCase().includes(query) ||
        trip.destination?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (selectedStatus) {
      result = result.filter((trip: any) => trip.status === selectedStatus);
    }

    // Apply type filter
    if (selectedType) {
      result = result.filter((trip: any) => trip.type === selectedType);
    }

    // Apply tab filter
    if (activeTab === 'upcoming') {
      result = result.filter((trip: any) => new Date(trip.startDate) > new Date());
    } else if (activeTab === 'past') {
      result = result.filter((trip: any) => new Date(trip.endDate) < new Date());
    } else if (activeTab === 'draft') {
      result = result.filter((trip: any) => trip.status === 'draft');
    }

    // Apply sorting
    result.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }
  
  // Derived state for filtered trips
  const filteredTrips = $derived(processTrips());

  // Handle filter changes
  function handleFilterChange(event: CustomEvent) {
    const { searchQuery: newSearch, status, type, sortBy: newSort } = event.detail;
    searchQuery = newSearch;
    selectedStatus = status;
    selectedType = type;
    sortBy = newSort;
  }

  // Handle trip creation
  function handleTripCreated(event: CustomEvent) {
    // In a real app, we would refresh the trips list or add the new trip to the list
    // For now, we'll just close the dialog and show a success message
    createDialogOpen = false;
    // You could add toast notification here
  }
</script>

<div class="container py-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">My Trips</h1>
      <p class="text-muted-foreground">Welcome back, {user.name}!</p>
    </div>
    
    <div class="flex gap-2">
      <CreateTripDialog 
        open={createDialogOpen} 
        on:created={handleTripCreated}
        on:openChange={(e) => createDialogOpen = e.detail}
      />
      <Button variant="ghost" on:click={() => signOut()}>Sign Out</Button>
    </div>
  </div>

  <!-- Tabs -->
  <Tabs value={activeTab} onValueChange={(value: string | undefined) => { if (value) activeTab = value; }} class="w-full">
    <TabsList class="grid grid-cols-4 mb-4">
      <TabsTrigger value="all">All Trips</TabsTrigger>
      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
      <TabsTrigger value="past">Past</TabsTrigger>
      <TabsTrigger value="draft">Drafts</TabsTrigger>
    </TabsList>

    <TabsContent value={activeTab} class="space-y-4">
      <!-- Filters -->
      <TripFilters
        searchQuery={searchQuery as string}
        status={selectedStatus as TripStatus | ''}
        type={selectedType as TripType | ''}
        sortBy={sortBy as string}
        on:filter={handleFilterChange}
      />

      <!-- Error message -->
      {#if error}
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      {/if}

      <!-- Trip grid -->
      {#if filteredTrips && filteredTrips.length > 0}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each filteredTrips as trip (trip.id)}
            {@const typedTrip = trip as TripSummary}
            <a href="/trips/{typedTrip.id}" class="block">
              <TripCard trip={typedTrip} />
            </a>
          {/each}
        </div>
      {:else}
        <Card>
          <CardContent class="flex flex-col items-center justify-center py-12">
            <div class="rounded-full bg-muted p-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">No trips found</h3>
            <p class="text-muted-foreground text-center mb-6">
              {#if searchQuery || selectedStatus || selectedType}
                No trips match your current filters. Try adjusting your search criteria.
              {:else}
                You haven't created any trips yet. Get started by creating your first trip!
              {/if}
            </p>
            <Button on:click={() => createDialogOpen = true}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Create Trip
            </Button>
          </CardContent>
        </Card>
      {/if}

      <!-- Pagination (for future implementation) -->
      <!-- <div class="flex justify-center mt-6">
        <Pagination />
      </div> -->
    </TabsContent>
  </Tabs>

  <!-- Help section -->
  <Separator class="my-8" />
  
  <div class="grid gap-6 md:grid-cols-3">
    <Card>
      <CardContent class="pt-6">
        <h3 class="text-lg font-medium mb-2">Need travel inspiration?</h3>
        <p class="text-muted-foreground text-sm mb-4">Explore popular destinations and get ideas for your next adventure.</p>
        <Button variant="outline" class="w-full" as="a" href="/travel-advisor">
          Travel Advisor
        </Button>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="pt-6">
        <h3 class="text-lg font-medium mb-2">Capture trip memories</h3>
        <p class="text-muted-foreground text-sm mb-4">Save photos, notes, and highlights from your travels.</p>
        <Button variant="outline" class="w-full" as="a" href="/memories">
          View Memories
        </Button>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent class="pt-6">
        <h3 class="text-lg font-medium mb-2">Share trip stories</h3>
        <p class="text-muted-foreground text-sm mb-4">Create and share travel stories with friends and family.</p>
        <Button variant="outline" class="w-full" as="a" href="/stories">
          Create Story
        </Button>
      </CardContent>
    </Card>
  </div>
</div>
