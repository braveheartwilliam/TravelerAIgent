<!-- src/routes/trips/+page.svelte -->
<script lang="ts">
  import { signOut } from '$lib/auth/auth';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { Separator } from '$lib/components/ui/separator';
  import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '$lib/components/ui/pagination';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import type { Selected } from 'bits-ui';
  import { ScrollToTop } from '$lib/components/ui/scroll-to-top';
  import TripCard from '$lib/components/trips/TripCard.svelte';
  import TripCardSkeleton from '$lib/components/trips/TripCardSkeleton.svelte';
  import TripFilters from '$lib/components/trips/TripFilters.svelte';
  import CreateTripDialog from '$lib/components/trips/CreateTripDialog.svelte';
  import { useTrips } from '$lib/hooks/useTrips';
  import type { PageData } from './$types';
  import type { TripSummary, TripStatus, TripType, TripVisibility } from '$lib/types/trip';

  // Import page data
  const { user } = $props();
  
  // State for filters
  let searchQuery = $state<string>('');
  let selectedStatus = $state<TripStatus | ''>('');
  let selectedType = $state<TripType | ''>('');
  let selectedVisibility = $state<TripVisibility | ''>('');
  let dateRange = $state<{ from: Date; to: Date } | null>(null);
  let budgetRange = $state<number[]>([0, 10000]);
  let sortBy = $state<string>('date-desc');
  // Define activeTab as string | undefined to match the Tabs component's expected type
  let activeTab = $state<string | undefined>('all');
  let createDialogOpen = $state<boolean>(false);
  
  // Pagination state
  let currentPage = $state<number>(1);
  let itemsPerPage = $state<number>(9); // Show 9 trips per page (3x3 grid)
  
  // Use TanStack Query to fetch trips with proper caching and error handling
  // Pass all filter parameters to the hook for server-side filtering and pagination
  const tripsQuery = $derived(() => useTrips({ 
    userId: user?.id || '',
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: selectedStatus,
    type: selectedType,
    visibility: selectedVisibility,
    dateFrom: dateRange?.from || null,
    dateTo: dateRange?.to || null,
    minBudget: budgetRange[0],
    maxBudget: budgetRange[1],
    sortBy: sortBy
  }));
  
  // Extract and derive reactive properties from the query result
  let tripsData = $derived(tripsQuery().data);
  let trips = $derived(tripsData?.trips || []);
  let totalItems = $derived(tripsData?.total || 0);
  let totalPages = $derived(tripsData?.totalPages || 1);
  let isLoading = $derived(tripsQuery().isLoading);
  let isFetching = $derived(tripsQuery().isFetching);
  let error = $derived(tripsQuery().error?.message);
  let refetch = $derived(() => tripsQuery().refetch);

  // Process trips data based on active tab
  function processTabFilter(): TripSummary[] {
    // Start with the server-filtered trips
    let result = [...trips];
    
    // Apply tab filter (this is the only filtering we do client-side now)
    if (activeTab === 'upcoming') {
      result = result.filter((trip: TripSummary) => new Date(trip.startDate) > new Date());
    } else if (activeTab === 'past') {
      result = result.filter((trip: TripSummary) => new Date(trip.endDate) < new Date());
    } else if (activeTab === 'draft') {
      result = result.filter((trip: TripSummary) => trip.status === 'draft');
    }
    
    return result;
  }
  
  // Derived state for filtered trips based on active tab
  const filteredTrips = $derived(processTabFilter());
  
  // Generate page numbers for pagination
  const pageNumbers = $derived(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        // Show ellipsis if current page is far from start
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        // Show ellipsis if current page is far from end
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  });

  // Handle filter changes
  function handleFilterChange(event: CustomEvent) {
    const { searchQuery: newSearch, status, type, visibility, dateRange: newDateRange, budget, sortBy: newSort } = event.detail;
    searchQuery = newSearch;
    selectedStatus = status;
    selectedType = type;
    selectedVisibility = visibility;
    dateRange = newDateRange;
    budgetRange = budget;
    sortBy = newSort;
    
    // Reset to first page when filters change
    currentPage = 1;
    
    // No need to manually refetch as the reactive query will update automatically
    // when the dependencies change
  }

  // Handle trip creation
  function handleTripCreated(event: CustomEvent) {
    createDialogOpen = false;
    refetch(); // Refresh the trips list
    // Show toast notification for trip creation success
    // Show toast if available (shadcn-svelte toast typing workaround)
    if (typeof window !== 'undefined' && typeof (window as any)['toast'] === 'function') {
      (window as any)['toast']({
        title: 'Trip Created',
        description: 'Your new trip has been created successfully!',
        variant: 'success',
      });
    } else {
      alert('Trip created successfully!');
    }
  }
</script>

<div class="container py-8">
  <!-- Page Title and Create Trip Button -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">My Trips</h1>
      <p class="text-muted-foreground text-base mt-1">
        Welcome back, {user?.name || user?.userName || user?.email || 'traveler'}!
      </p>
    </div>
    <div class="flex gap-2">
      <Button variant="default" class="text-base px-6 py-3" on:click={() => createDialogOpen = true}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
        Create Trip
      </Button>
      <CreateTripDialog 
        open={createDialogOpen} 
        on:created={handleTripCreated}
        on:openChange={(e) => createDialogOpen = e.detail}
      />
    </div>
  </div>


  <!-- Tabs -->
  <!-- Using Tabs component with proper type handling and Svelte 5 syntax -->
  <Tabs 
    value={activeTab} 
    defaultValue="all"
    onValueChange={(value: any) => { 
      activeTab = value as string | undefined;
    }} 
    class="w-full" {...{} as any}
  >
    <TabsList class="grid grid-cols-4 mb-4" {...{} as any}>
      {#each [{ value: 'all', label: 'All Trips' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }, { value: 'draft', label: 'Drafts' }] as tab}
        <TabsTrigger value={tab.value} type="button">{tab.label}</TabsTrigger>
      {/each}
    </TabsList>

    <TabsContent value={activeTab ?? 'all'} class="space-y-4" {...{} as any}>
      <!-- Filters -->
      <TripFilters
        searchQuery={searchQuery}
        status={selectedStatus}
        type={selectedType}
        visibility={selectedVisibility}
        dateRange={dateRange}
        budget={budgetRange}
        sortBy={sortBy}
        on:filterChange={handleFilterChange}
      />

      <!-- Error message -->
      {#if error}
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="link" class="p-0 h-auto font-normal underline" on:click={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      {/if}

      <!-- Loading skeletons -->
      {#if isLoading}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each Array(itemsPerPage) as _, i}
            <TripCardSkeleton />
          {/each}
        </div>
      
      <!-- Trip grid -->
      {:else if Array.isArray(filteredTrips) && filteredTrips.length > 0}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Show loading overlay when fetching new data but not on initial load -->
          {#if isFetching && !isLoading}
            <div class="col-span-full flex justify-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          {/if}
          
          {#each filteredTrips as trip (trip?.id)}
  {#if trip && trip.title}
    <div class="h-full">
      <a 
        href={trip.id ? `/trips/${trip.id}` : undefined} 
        class="block h-full" 
        aria-label={trip.title ? `View details for ${trip.title}` : undefined}
        tabindex="0"
        onkeydown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (trip.id) window.location.href = `/trips/${trip.id}`;
          }
        }}
      >
        <TripCard {trip} />
      </a>
    </div>
  {/if}
{/each}
        </div>
        
        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="mt-8">
            <Pagination>
              <PaginationContent>
                <!-- Previous page button -->
                <PaginationItem>
                  <PaginationLink 
                    disabled={currentPage <= 1}
                    ariaLabel="Go to previous page"
                    on:click={() => {
                      if (currentPage > 1) currentPage--;
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    <span class="sr-only">Previous page</span>
                  </PaginationLink>
                </PaginationItem>
                
                <!-- Page numbers -->
                {#each pageNumbers() as pageNum}
                  {#if pageNum === -1 || pageNum === -2}
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  {:else}
                    <PaginationItem>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        ariaLabel={`Go to page ${pageNum}`}
                        on:click={() => currentPage = pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  {/if}
                {/each}
                
                <!-- Next page button -->
                <PaginationItem>
                  <PaginationLink 
                    disabled={currentPage >= totalPages}
                    ariaLabel="Go to next page"
                    on:click={() => {
                      if (currentPage < totalPages) currentPage++;
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    <span class="sr-only">Next page</span>
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        {/if}
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
            <div class="flex flex-col items-center">
              <span class="text-sm text-blue-700 font-semibold mt-2">Click the <span class="underline">Create Trip</span> button above to get started!</span>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Trip count summary and pagination controls -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground mt-4">
        <div>
          Showing {filteredTrips.length} of {totalItems} trips
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label for="items-per-page" class="text-sm font-medium">Show:</label>
            <!-- Using Select component with proper type handling -->
            <Select 
              selected={{ value: itemsPerPage.toString() }} 
              onSelectedChange={(selected) => {
                if (selected && typeof selected === 'object' && 'value' in selected) {
                  const value = (selected as { value: string }).value;
                  itemsPerPage = parseInt(value);
                  // Reset to page 1 when changing items per page
                  currentPage = 1;
                }
              }}
            >
              <SelectTrigger id="items-per-page" class="w-[80px] h-8">
                <SelectValue placeholder="9" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
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
