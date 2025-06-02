<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { format } from 'date-fns';
  import { Button } from '$lib/components/ui/button';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
  import { Separator } from '$lib/components/ui/separator';
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$lib/components/ui/tooltip';
  import Command from '$lib/components/ui/command/command.svelte';
  import CommandInput from '$lib/components/ui/command/command-input.svelte';
  import CommandList from '$lib/components/ui/command/command-list.svelte';
  import CommandEmpty from '$lib/components/ui/command/command-empty.svelte';
  import CommandGroup from '$lib/components/ui/command/command-group.svelte';
  import CommandItem from '$lib/components/ui/command/command-item.svelte';
  import { CalendarIcon, Plus, HelpCircle, Palmtree, Users, Briefcase, Ship, Luggage } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import type { Trip, TripType, TripStatus, TripVisibility } from '$lib/types/trip';
  import { createTrip } from '$lib/services/tripService';

  import { Info, Check, MapPin } from 'lucide-svelte';
  
  // Define props
  const { open = false } = $props<{ open?: boolean }>();
  
  // Define events
  const dispatch = createEventDispatcher<{
    created: Trip;
    openChange: boolean;
  }>();
  
  // Local state to track dialog open state
  let isOpen = $state(open);
  
  // Form state
  let title = $state('');
  let description = $state('');
  let startDate = $state<Date | undefined>(undefined);
  let endDate = $state<Date | undefined>(undefined);
  let budget = $state(0);
  let tripType = $state<TripType>('user-planned');
  let tripStatus = $state<TripStatus>('draft');
  let tripVisibility = $state<TripVisibility>('private');
  let startLocation = $state('');
  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});
  
  // Location suggestion states
  let showLocationSuggestions = $state(false);
  let locationInputValue = $state('');
  let selectedLocation = $state<string | null>(null);
  
  // Popular destination suggestions
  const popularDestinations = [
    { name: 'New York City, USA', region: 'North America' },
    { name: 'Paris, France', region: 'Europe' },
    { name: 'Tokyo, Japan', region: 'Asia' },
    { name: 'Sydney, Australia', region: 'Oceania' },
    { name: 'Cape Town, South Africa', region: 'Africa' },
    { name: 'Rio de Janeiro, Brazil', region: 'South America' },
    { name: 'London, UK', region: 'Europe' },
    { name: 'Bangkok, Thailand', region: 'Asia' },
    { name: 'Vancouver, Canada', region: 'North America' },
    { name: 'Dubai, UAE', region: 'Middle East' },
    { name: 'Auckland, New Zealand', region: 'Oceania' },
    { name: 'Marrakech, Morocco', region: 'Africa' }
  ];
  
  // Filtered destinations based on input
  $effect(() => {
    if (locationInputValue) {
      startLocation = locationInputValue;
    }
  });
  
  function selectLocation(location: string) {
    locationInputValue = location;
    startLocation = location;
    selectedLocation = location;
    showLocationSuggestions = false;
  }
  
  function getFilteredDestinations() {
    if (!locationInputValue) return popularDestinations;
    
    const searchTerm = locationInputValue.toLowerCase();
    return popularDestinations.filter(dest => 
      dest.name.toLowerCase().includes(searchTerm) || 
      dest.region.toLowerCase().includes(searchTerm)
    );
  }
  
  // Trip type options with detailed descriptions
  const tripTypeOptions = [
    { 
      value: 'user-planned', 
      label: 'Self-Planned Trip', 
      description: 'A trip you organize yourself with complete control over itinerary, accommodations, and activities.'
    },
    { 
      value: 'guided-trip', 
      label: 'Guided Trip', 
      description: 'A trip led by professional guides with structured itineraries and expert knowledge of destinations.'
    },
    { 
      value: 'land-cruise', 
      label: 'Land Cruise', 
      description: 'A multi-destination tour by land with pre-arranged accommodations and transportation between locations.'
    },
    { 
      value: 'ship-cruise', 
      label: 'Ship Cruise', 
      description: 'A voyage by ship with onboard accommodations and stops at multiple ports or destinations.'
    }
  ];
  
  // Trip status options with descriptions
  const statusOptions = [
    { value: 'draft', label: 'Draft', description: 'Initial planning stage, not finalized' },
    { value: 'planned', label: 'Planned', description: 'Itinerary finalized but trip hasn\'t started' },
    { value: 'in-progress', label: 'In Progress', description: 'Currently on this trip' },
    { value: 'completed', label: 'Completed', description: 'Trip has ended' },
    { value: 'cancelled', label: 'Cancelled', description: 'Trip was cancelled' }
  ];
  
  // Trip visibility options
  const visibilityOptions = [
    { value: 'private', label: 'Private', description: 'Only visible to you' },
    { value: 'shared', label: 'Shared', description: 'Visible to specific people you share with' },
    { value: 'public', label: 'Public', description: 'Visible to everyone' }
  ];
  
  // Validate form
  function validateForm() {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors['title'] = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors['description'] = 'Description is required';
    }
    
    if (!startDate) {
      newErrors['startDate'] = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors['endDate'] = 'End date is required';
    } else if (startDate && endDate && endDate < startDate) {
      newErrors['endDate'] = 'End date must be after start date';
    }
    
    if (budget < 0) {
      newErrors['budget'] = 'Budget must be a positive number';
    }
    
    if (!startLocation.trim()) {
      newErrors['startLocation'] = 'Starting location is required';
    }
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  // Handle form submission
  async function handleSubmit() {
    if (!validateForm()) return;
    
    isSubmitting = true;
    
    try {
      // Create new trip
      const newTrip = await createTrip({
        title,
        description,
        startDate: startDate!,
        endDate: endDate!,
        budget,
        type: tripType,
        status: tripStatus,
        visibility: tripVisibility,
        startLocation
      });
      
      // Reset form
      resetForm();
      
      // Close dialog
      isOpen = false;
      dispatch('openChange', false);
      
      // Notify parent component
      dispatch('created', newTrip);
    } catch (error) {
      console.error('Failed to create trip:', error);
      errors['submit'] = 'Failed to create trip. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  // Trip templates
  const tripTemplates = [
    {
      id: 'weekend-getaway',
      name: 'Weekend Getaway',
      description: 'A quick weekend trip to a nearby destination',
      durationDays: 3,
      budget: 500,
      type: 'user-planned' as TripType,
      icon: 'palm-tree'
    },
    {
      id: 'family-vacation',
      name: 'Family Vacation',
      description: 'A week-long family trip with activities for all ages',
      durationDays: 7,
      budget: 3000,
      type: 'user-planned' as TripType,
      icon: 'users'
    },
    {
      id: 'business-trip',
      name: 'Business Trip',
      description: 'A professional trip with meetings and networking events',
      durationDays: 4,
      budget: 1500,
      type: 'user-planned' as TripType,
      icon: 'briefcase'
    },
    {
      id: 'cruise',
      name: 'Cruise Adventure',
      description: 'A relaxing cruise with multiple port stops',
      durationDays: 10,
      budget: 4000,
      type: 'ship-cruise' as TripType,
      icon: 'ship'
    },
    {
      id: 'backpacking',
      name: 'Backpacking Adventure',
      description: 'An adventurous trip exploring multiple locations on a budget',
      durationDays: 14,
      budget: 2000,
      type: 'guided-trip' as TripType,
      icon: 'backpack'
    }
  ];
  
  // Apply template to form
  function applyTemplate(templateId: string) {
    const template = tripTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    // Set basic details
    tripType = template.type;
    budget = template.budget;
    
    // Set dates based on template duration
    const today = new Date();
    startDate = new Date(today);
    endDate = new Date(today);
    endDate.setDate(today.getDate() + template.durationDays - 1);
    
    // Set title and description with placeholders
    title = template.name;
    description = template.description;
  }
  
  // Reset form
  function resetForm() {
    title = '';
    description = '';
    startDate = undefined;
    endDate = undefined;
    budget = 0;
    tripType = 'user-planned';
    tripStatus = 'draft';
    tripVisibility = 'private';
    startLocation = '';
    locationInputValue = '';
    selectedLocation = null;
    errors = {};
  }
  
  // Handle dialog close
  function handleOpenChange(open: boolean) {
    isOpen = open;
    dispatch('openChange', open);
    
    if (!open) {
      resetForm();
    }
  }
  
  // Format date for display
  function formatDate(date: Date | undefined): string {
    return date ? format(date, 'PPP') : 'Select date';
  }
</script>

<Dialog open={isOpen} onOpenChange={handleOpenChange}>
  <DialogTrigger asChild let:builder>
    <Button variant="default" builders={[builder]} class="gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      Create Trip
    </Button>
  </DialogTrigger>
  
  <DialogContent class="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Create a new trip</DialogTitle>
      <DialogDescription>
        Fill in the details to create your new trip. You can edit these later.
      </DialogDescription>
    </DialogHeader>
    
    <!-- Trip Templates Section -->
    <div class="mb-6">
      <h3 class="text-sm font-medium mb-2">Start with a template</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {#each tripTemplates as template}
          <button
            type="button"
            class="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-accent transition-colors"
            onclick={() => applyTemplate(template.id)}
          >
            <div class="w-8 h-8 flex items-center justify-center mb-1">
              {#if template.icon === 'palm-tree'}
                <Palmtree class="h-5 w-5" />
              {:else if template.icon === 'users'}
                <Users class="h-5 w-5" />
              {:else if template.icon === 'briefcase'}
                <Briefcase class="h-5 w-5" />
              {:else if template.icon === 'ship'}
                <Ship class="h-5 w-5" />
              {:else if template.icon === 'backpack'}
                <Luggage class="h-5 w-5" />
              {/if}
            </div>
            <span class="text-xs font-medium">{template.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <Separator class="my-4" />
    
    <form onsubmit={(e: Event) => { e.preventDefault(); handleSubmit(); }} class="space-y-4 py-4">
      <div class="space-y-2">
        <Label for="title" class="text-right">Title</Label>
        <Input 
          id="title" 
          bind:value={title} 
          placeholder="Enter trip title" 
          class={errors['title'] ? 'border-red-500' : ''}
        />
        {#if errors['title']}
          <p class="text-red-500 text-xs">{errors['title']}</p>
        {/if}
      </div>
      
      <div class="space-y-2">
        <Label for="description" class="text-right">Description</Label>
        <Textarea 
          id="description" 
          bind:value={description} 
          placeholder="Enter trip description" 
          class={errors['description'] ? 'border-red-500' : ''}
        />
        {#if errors['description']}
          <p class="text-red-500 text-xs">{errors['description']}</p>
        {/if}
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                class={`w-full justify-start text-left font-normal ${errors['startDate'] ? 'border-red-500' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                {formatDate(startDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                fromDate={new Date()}
                toDate={undefined}
                initialFocus
                on:select={(e) => {
                  startDate = e.detail;
                  validateForm();
                }}
              />
            </PopoverContent>
          </Popover>
          {#if errors['startDate']}
            <p class="text-red-500 text-xs">{errors['startDate']}</p>
          {/if}
        </div>
        
        <div class="space-y-2">
          <Label for="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                class={`w-full justify-start text-left font-normal ${errors['endDate'] ? 'border-red-500' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                {formatDate(endDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar 
                mode="single" 
                selected={endDate} 
                fromDate={startDate}
                toDate={undefined}
                on:select={(e) => {
                  const date = e.detail;
                  if (date instanceof Date) {
                    endDate = date;
                  }
                }} 
                initialFocus 
              />
            </PopoverContent>
          </Popover>
          {#if errors['endDate']}
            <p class="text-red-500 text-xs">{errors['endDate']}</p>
          {/if}
        </div>
      </div>
      
      <div class="space-y-2">
        <Label for="startLocation" class="text-right">Starting Location</Label>
        <div class="relative">
          <Popover open={showLocationSuggestions} onOpenChange={(open: boolean) => showLocationSuggestions = open}>
            <PopoverTrigger asChild>
              <div class="flex w-full items-center">
                <Input 
                  id="startLocation" 
                  value={locationInputValue}
                  on:input={(e) => {
                    locationInputValue = e.currentTarget.value;
                    if (locationInputValue.length > 1) {
                      showLocationSuggestions = true;
                    }
                  }}
                  placeholder="Enter starting location" 
                  class={`${errors['startLocation'] ? 'border-red-500' : ''} pr-10`}
                  aria-expanded={showLocationSuggestions}
                  aria-autocomplete="list"
                  aria-controls="location-suggestions"
                  aria-label="Search for a location"
                />
                <MapPin class="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search locations..." 
                  value={locationInputValue}
                  onValueChange={(value: string) => locationInputValue = value}
                />
                <CommandList id="location-suggestions">
                  <CommandEmpty>No locations found</CommandEmpty>
                  <CommandGroup heading="Popular Destinations">
                    {#each getFilteredDestinations() as destination}
                      <CommandItem 
                        value={destination.name}
                        onSelect={() => selectLocation(destination.name)}
                        class="flex items-center justify-between"
                      >
                        <div>
                          <span>{destination.name}</span>
                          <span class="text-xs text-muted-foreground ml-2">{destination.region}</span>
                        </div>
                        {#if selectedLocation === destination.name}
                          <Check class="h-4 w-4" />
                        {/if}
                      </CommandItem>
                    {/each}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {#if errors['startLocation']}
          <p class="text-red-500 text-xs">{errors['startLocation']}</p>
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="budget">Budget ($)</Label>
          <Input 
            id="budget" 
            type="number" 
            bind:value={budget} 
            min="0" 
            step="100"
            class={errors['budget'] ? 'border-red-500' : ''}
          />
          {#if errors['budget']}
            <p class="text-red-500 text-xs">{errors['budget']}</p>
          {/if}
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Label for="tripType">Trip Type</Label>
            <TooltipProvider>
              <Tooltip text="Select the type of trip you're planning">
                <TooltipTrigger>
                  <Info class="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p class="w-80">Select the type of trip you're planning</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select selected={{ value: tripType }} onSelectedChange={(selected) => { if (selected) tripType = (selected as any).value as TripType; }}>
            <SelectTrigger id="tripType">
              <SelectValue placeholder="Select trip type" />
            </SelectTrigger>
            <SelectContent>
              {#each tripTypeOptions as option}
                <SelectItem value={option.value}>
                  <div>
                    <div>{option.label}</div>
                    <div class="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Label for="tripStatus">Status</Label>
            <TooltipProvider>
              <Tooltip text="Trip Status">
                <TooltipTrigger>
                  <HelpCircle class="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Choose a trip status that best describes your current situation.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select selected={{ value: tripStatus }} onSelectedChange={(selected: any) => { if (selected) tripStatus = selected.value as TripStatus; }}>
            <SelectTrigger id="tripStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {#each statusOptions as option}
                <SelectItem value={option.value}>
                  <div>
                    <div>{option.label}</div>
                    <div class="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Label for="tripVisibility">Visibility</Label>
            <TooltipProvider>
              <Tooltip text="Trip Visibility">
                <TooltipTrigger>
                  <Info class="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p class="w-80">Control who can see your trip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select selected={{ value: tripVisibility }} onSelectedChange={(selected) => { if (selected) tripVisibility = (selected as any).value as TripVisibility; }}>
            <SelectTrigger id="tripVisibility">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              {#each visibilityOptions as option}
                <SelectItem value={option.value}>
                  <div>
                    <div>{option.label}</div>
                    <div class="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {#if errors['submit']}
        <p class="text-red-500 text-sm">{errors['submit']}</p>
      {/if}
      
      <DialogFooter>
        <Button type="button" variant="outline" on:click={() => handleOpenChange(false)}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          {:else}
            Create Trip
          {/if}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
