<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Slider } from '$lib/components/ui/slider';
  import { Badge } from '$lib/components/ui/badge';
  import { Tooltip } from '$lib/components/ui/tooltip';
  import { format } from 'date-fns';
  import { Search, Calendar as CalendarIcon, Filter, SlidersHorizontal, Info, X } from 'lucide-svelte';
  import type { TripStatus, TripType, TripVisibility } from '$lib/types/trip';
  import { createEventDispatcher } from 'svelte';

  const { 
    searchQuery = '',
    status = '',
    type = '',
    visibility = '',
    dateRange = null,
    budget = [0, 10000],
    sortBy = 'startDate',
    destination = ''
  } = $props<{
    searchQuery: string;
    status: TripStatus | '';
    type: TripType | '';
    visibility: TripVisibility | '';
    dateRange: { from: Date; to: Date } | null;
    budget: number[];
    sortBy: string;
    destination?: string;
  }>();
  
  // Define events
  const dispatch = createEventDispatcher<{
    filterChange: {
      searchQuery: string;
      status: TripStatus | '';
      type: TripType | '';
      visibility: TripVisibility | '';
      dateRange: { from: Date; to: Date } | null;
      budget: number[];
      sortBy: string;
      destination: string;
    };
  }>();
  
  // Define filter options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft', description: 'Trips that are still being planned' },
    { value: 'in-progress', label: 'In Progress', description: 'Trips that are currently happening' },
    { value: 'completed', label: 'Completed', description: 'Trips that have been completed' },
    { value: 'cancelled', label: 'Cancelled', description: 'Trips that have been cancelled' },
    { value: 'on-hold', label: 'On Hold', description: 'Trips that are temporarily paused' },
    { value: 'deleted', label: 'Deleted', description: 'Trips that have been marked for deletion' }
  ];
  
  const typeOptions = [
    { value: '', label: 'All Types' },
    { 
      value: 'land-cruise', 
      label: 'Land Cruise', 
      description: 'A trip planned and executed on land by a guide or travel company with a set itinerary and destinations'
    },
    { 
      value: 'ship-cruise', 
      label: 'Ship Cruise', 
      description: 'A trip planned and executed on a ship with a set itinerary and destinations'
    },
    { 
      value: 'guided-trip', 
      label: 'Guided Trip', 
      description: 'A trip planned and executed by a guide with a set itinerary and destinations'
    },
    { 
      value: 'user-planned', 
      label: 'Self-Planned', 
      description: 'A trip that you plan and manage yourself with your own itinerary and destinations'
    }
  ];
  
  const visibilityOptions = [
    { value: '', label: 'All Visibility' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' }
  ];
  
  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'budget-asc', label: 'Budget (Low to High)' },
    { value: 'budget-desc', label: 'Budget (High to Low)' }
  ];
  
  // Local state for form values
  let localSearchQuery = $state(searchQuery);
  let localStatus = $state<TripStatus | ''>(status);
  let localType = $state<TripType | ''>(type);
  let localVisibility = $state<TripVisibility | ''>(visibility);
  let localDateRange = $state(dateRange);
  let localBudget = $state<number[]>(budget);
  let localSortBy = $state(sortBy);
  let localDestination = $state(destination || '');
  let showAdvancedFilters = $state(false);
  let dateFilterType = $state<'all' | 'upcoming' | 'current' | 'past'>('all');
  
  // Tooltip states
  let statusTooltipOpen = $state(false);
  let typeTooltipOpen = $state(false);
  let visibilityTooltipOpen = $state(false);
  let dateTooltipOpen = $state(false);
  let budgetTooltipOpen = $state(false);
  let destinationTooltipOpen = $state(false);
  
  // Format date for display
  function formatDateRange(range: { from: Date; to: Date } | null): string {
    if (!range) return 'Select dates';
    return `${format(range.from, 'PP')} - ${format(range.to, 'PP')}`;
  }
  
  // Format budget for display
  function formatBudget(budget: number[] | undefined): string {
    if (!budget || budget.length !== 2) return '$0 - $10,000+';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
    
    // Ensure values are numbers before formatting
    const minValue = budget[0] ?? 0;
    const maxValue = budget[1] ?? 10000;
    
    const min = formatter.format(minValue);
    const max = maxValue >= 10000 ? '$10,000+' : formatter.format(maxValue);
    
    return `${min} - ${max}`;
  }
  
  // Get date range label
  function getDateRangeLabel(range: { from: Date; to: Date } | null): string {
    if (!range || !range.from || !range.to) return '';
    
    const now = new Date();
    const { from, to } = range;
    
    // Check if date range is in the past, present, or future
    if (to < now) {
      return 'Past';
    } else if (from <= now && to >= now) {
      return 'Current';
    } else {
      return 'Upcoming';
    }
  }
  
  // Computed values
  let activeFilterCount = $derived(
    (localStatus ? 1 : 0) +
    (localType ? 1 : 0) +
    (localVisibility ? 1 : 0) +
    (localDateRange ? 1 : 0) +
    ((localBudget && Array.isArray(localBudget) && localBudget.length === 2 && (localBudget[0] > 0 || localBudget[1] < 10000)) ? 1 : 0) +
    (localDestination ? 1 : 0)
  );
  
  let hasActiveSearch = $derived(localSearchQuery.trim().length > 0);
  
  // Handle filter changes
  function handleFilterChange() {
    // Dispatch event with all filter values
    dispatch('filterChange', {
      searchQuery: localSearchQuery,
      status: localStatus,
      type: localType,
      visibility: localVisibility,
      dateRange: localDateRange,
      budget: localBudget,
      sortBy: localSortBy,
      destination: localDestination
    });
  }
  
  // Reset filters
  function resetFilters(): void {
    localSearchQuery = '';
    localStatus = '';
    localType = '';
    localVisibility = '';
    localDateRange = null;
    localBudget = [0, 10000];
    localSortBy = 'date-desc';
    localDestination = '';
    dateFilterType = 'all';
    handleFilterChange();
  }
</script>

<div class="bg-card rounded-lg shadow-sm mb-6 overflow-hidden border">
  <div class="p-4 border-b">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative w-full sm:max-w-sm">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search trips..." 
          bind:value={localSearchQuery}
          on:input={() => handleFilterChange()}
          class="pl-9 transition-colors focus-visible:ring-primary/20"
        />
        {#if hasActiveSearch}
          <button 
            class="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            onclick={() => { localSearchQuery = ''; handleFilterChange(); }}
            aria-label="Clear search"
          >
            <X class="h-4 w-4" />
          </button>
        {/if}
      </div>
      
      <div class="flex gap-2 w-full sm:w-auto">
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" size="sm" class="flex-1 sm:flex-none gap-1 transition-colors hover:bg-secondary/20">
              <Filter class="h-4 w-4" />
              <span>Filters</span>
              {#if activeFilterCount > 0}
                <Badge variant="secondary" class="ml-1">{activeFilterCount}</Badge>
              {/if}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80 p-4">
            <div class="grid gap-4">
              <div class="space-y-2">
                <div class="flex items-center gap-1">
                  <h4 class="font-medium">Status</h4>
                  <Tooltip text="Filter trips by their current status (draft, in progress, completed, etc.)" open={statusTooltipOpen}>
                    <Info class="h-4 w-4 text-muted-foreground cursor-help" />
                  </Tooltip>
                </div>
                <Select
                  selected={{ value: localStatus }}
                  onSelectedChange={(selected) => { 
                    if (selected) {
                      localStatus = (selected as { value: TripStatus | '' }).value;
                      handleFilterChange();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {#each statusOptions as option}
                      <SelectItem value={option.value}>
                        {#if option.description}
                          <div>
                            <div>{option.label}</div>
                            {#if option.value}
                              <div class="text-xs text-muted-foreground">{option.description}</div>
                            {/if}
                          </div>
                        {:else}
                          {option.label}
                        {/if}
                      </SelectItem>
                    {/each}
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center gap-1">
                  <h4 class="font-medium">Trip Type</h4>
                  <Tooltip text="Filter by trip type: land cruises (guided land tours), ship cruises (ocean/river cruises), guided trips (tours with guides), or self-planned trips (trips you organize yourself)" open={typeTooltipOpen}>
                    <Info class="h-4 w-4 text-muted-foreground cursor-help" />
                  </Tooltip>
                </div>
                <Select
                  selected={{ value: localType }}
                  onSelectedChange={(selected) => { 
                    if (selected) {
                      localType = (selected as { value: TripType | '' }).value;
                      handleFilterChange();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {#each typeOptions as option}
                      <SelectItem value={option.value}>
                        {#if option.description}
                          <div>
                            <div>{option.label}</div>
                            {#if option.value}
                              <div class="text-xs text-muted-foreground">{option.description}</div>
                            {/if}
                          </div>
                        {:else}
                          {option.label}
                        {/if}
                      </SelectItem>
                    {/each}
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center gap-1">
                  <h4 class="font-medium">Visibility</h4>
                  <Tooltip text="Filter trips by visibility: public (visible to others) or private (only visible to you)" open={visibilityTooltipOpen}>
                    <Info class="h-4 w-4 text-muted-foreground cursor-help" />
                  </Tooltip>
                </div>
                <Select
                  selected={{ value: localVisibility }}
                  onSelectedChange={(selected) => { 
                    if (selected) {
                      localVisibility = (selected as { value: TripVisibility | '' }).value;
                      handleFilterChange();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {#each visibilityOptions as option}
                      <SelectItem value={option.value}>{option.label}</SelectItem>
                    {/each}
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center gap-1">
                  <h4 class="font-medium">Date Range</h4>
                  <Tooltip text="Filter trips by their start and end dates. This helps you find past, current, or upcoming trips." open={dateTooltipOpen}>
                    <Info class="h-4 w-4 text-muted-foreground cursor-help" />
                  </Tooltip>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      id="date-range"
                      variant="outline"
                      class={`w-full justify-start text-left font-normal ${localDateRange ? '' : 'text-muted-foreground'}`}
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      <span>{formatDateRange(localDateRange)}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <div class="p-2 border-b">
                      <div class="flex justify-between items-center">
                        <h4 class="font-medium text-sm">Select date range</h4>
                        {#if localDateRange}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            class="h-7 px-2 text-xs" 
                            onclick={() => {
                              localDateRange = null;
                              handleFilterChange();
                            }}
                          >
                            Clear
                          </Button>
                        {/if}
                      </div>
                    </div>
                    <Calendar
                      mode="range"
                      selected={localDateRange}
                      on:select={(event) => {
                        const range = event.detail;
                        localDateRange = range;
                        if (range?.from && range?.to) {
                          handleFilterChange();
                        }
                      }}
                      numberOfMonths={2}
                      className="rounded-md border shadow"
                      fromDate={undefined}
                      toDate={undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center gap-1">
                  <h4 class="font-medium">Destination</h4>
                  <Tooltip text="Filter trips by destination name or location" open={destinationTooltipOpen}>
                    <Info class="h-4 w-4 text-muted-foreground cursor-help" />
                  </Tooltip>
                </div>
                <Input
                  type="text"
                  placeholder="Enter destination..."
                  bind:value={localDestination}
                  on:input={() => handleFilterChange()}
                />
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center gap-1">
                  <h4 class="font-medium">Budget Range</h4>
                  <Tooltip text="Filter trips by their budget range in US dollars. The budget represents the total estimated cost of the trip." open={budgetTooltipOpen}>
                    <Info class="h-4 w-4 text-muted-foreground cursor-help" />
                  </Tooltip>
                </div>
                <span class="text-sm text-muted-foreground">{formatBudget(localBudget)}</span>
                <Slider
                  value={localBudget}
                  onValueChange={(value: number[]) => {
                    localBudget = value;
                    handleFilterChange();
                  }}
                  min={0}
                  max={10000}
                  step={100}
                />
                <div class="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>$0</span>
                  <span>$5,000</span>
                  <span>$10,000+</span>
                </div>
              </div>
              
              <div class="pt-2 border-t">
                <Button variant="outline" size="sm" onclick={resetFilters} class="w-full">Reset All Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" size="sm" class="flex-1 sm:flex-none gap-1 transition-colors hover:bg-secondary/20">
              <SlidersHorizontal class="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-56 p-2">
            <div class="grid gap-1">
              <div class="px-2 py-1.5 text-sm font-medium text-muted-foreground">Sort by</div>
              {#each sortOptions as option}
                <Button 
                  variant={localSortBy === option.value ? "secondary" : "ghost"} 
                  class="justify-start font-normal" 
                  onclick={() => {
                    localSortBy = option.value;
                    handleFilterChange();
                  }}
                >
                  {option.label}
                </Button>
              {/each}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
  
  <!-- Active filters display -->
  {#if activeFilterCount > 0 || hasActiveSearch}
    <div class="px-4 py-2 bg-muted/50 flex flex-wrap gap-2 items-center border-t">
      <span class="text-sm font-medium">Active filters:</span>
      
      {#if hasActiveSearch}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Search: {localSearchQuery.length > 15 ? `${localSearchQuery.substring(0, 15)}...` : localSearchQuery}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localSearchQuery = ''; handleFilterChange(); }}
            aria-label="Clear search filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      {#if localStatus}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Status: {statusOptions.find(o => o.value === localStatus)?.label || 'All Statuses'}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localStatus = ''; handleFilterChange(); }}
            aria-label="Clear status filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      {#if localType}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Type: {typeOptions.find(o => o.value === localType)?.label || 'All Types'}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localType = ''; handleFilterChange(); }}
            aria-label="Clear type filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      {#if localVisibility}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Visibility: {visibilityOptions.find(o => o.value === localVisibility)?.label || 'All'}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localVisibility = ''; handleFilterChange(); }}
            aria-label="Clear visibility filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      {#if localDateRange}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Dates: {getDateRangeLabel(localDateRange)}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localDateRange = null; handleFilterChange(); }}
            aria-label="Clear date range filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      {#if localDestination}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Destination: {localDestination}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localDestination = ''; handleFilterChange(); }}
            aria-label="Clear destination filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      {#if localBudget && Array.isArray(localBudget) && localBudget.length === 2 && (localBudget[0] > 0 || localBudget[1] < 10000)}
        <Badge variant="secondary" class="gap-1 hover:bg-secondary/80 transition-colors">
          Budget: {formatBudget(localBudget)}
          <button 
            class="ml-1 hover:bg-secondary/90 rounded-full" 
            onclick={() => { localBudget = [0, 10000]; handleFilterChange(); }}
            aria-label="Clear budget filter"
          >
            <X class="h-3 w-3" />
          </button>
        </Badge>
      {/if}
      
      <Button 
        variant="ghost" 
        size="sm" 
        class="ml-auto text-xs hover:bg-secondary/20 transition-colors" 
        onclick={resetFilters}
      >
        Clear All
      </Button>
    </div>
  {/if}
</div>
