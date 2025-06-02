<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { createEventDispatcher } from 'svelte';
  import type { Trip, TripStatus, TripType, TripVisibility } from '$lib/types/trip';
  
  // Define props
  const { trip = null, open = false } = $props<{
    trip?: Trip | null;
    open: boolean;
  }>();
  
  // Define events
  const dispatch = createEventDispatcher<{
    save: Partial<Trip>;
    cancel: void;
    openChange: boolean;
  }>();
  
  // Local state to track dialog open state
  let isOpen = $state(open);
  
  // Form state
  let title = $state(trip?.title || '');
  let description = $state(trip?.description || '');
  let startDate = $state<Date | undefined>(trip?.startDate ? new Date(trip.startDate) : undefined);
  let endDate = $state<Date | undefined>(trip?.endDate ? new Date(trip.endDate) : undefined);
  let budget = $state(trip?.budget || 0);
  let status = $state<TripStatus>(trip?.status || 'draft');
  let type = $state<TripType>(trip?.type || 'user-planned');
  let visibility = $state<TripVisibility>(trip?.visibility || 'private');
  
  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});
  
  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'on-hold', label: 'On Hold' }
  ];
  
  // Trip type options
  const typeOptions = [
    { value: 'land-cruise', label: 'Land Cruise' },
    { value: 'ship-cruise', label: 'Ship Cruise' },
    { value: 'guided-trip', label: 'Guided Trip' },
    { value: 'user-planned', label: 'Self-Planned' }
  ];
  
  // Visibility options
  const visibilityOptions = [
    { value: 'private', label: 'Private' },
    { value: 'public', label: 'Public' }
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
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  // Handle form submission
  function handleSubmit() {
    if (!validateForm()) return;
    
    isSubmitting = true;
    
    try {
      // Create trip object
      const updatedTrip: Partial<Trip> = {
        title,
        description,
        startDate: startDate as Date,  // We've validated this exists in validateForm
        endDate: endDate as Date,      // We've validated this exists in validateForm
        budget,
        status,
        type,
        visibility
      };
      
      // Dispatch save event
      dispatch('save', updatedTrip);
      
      // Close dialog
      handleOpenChange(false);
    } catch (error) {
      console.error('Failed to save trip:', error);
      errors['submit'] = 'Failed to save trip. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  // Handle dialog close
  function handleOpenChange(newOpenState: boolean) {
    isOpen = newOpenState;
    dispatch('openChange', newOpenState);
    
    if (!newOpenState) {
      dispatch('cancel');
    }
  }
  
  // Format date for display
  function formatDate(date: Date | undefined): string {
    if (!date) return '';
    try {
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }
  
  // Safely parse date string
  function safeDateParse(dateString: string | undefined): Date | undefined {
    if (!dateString || dateString.trim() === '') return undefined;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  }
  
  // Convert string types to Select compatible values
  function toSelectValue(value: string): any {
    return { value };
  }
  
  // Extract value from Select component's selected value
  function fromSelectValue(selected: any): string {
    return selected?.value || '';
  }
  
  // Parse date string safely
  function parseDate(dateString: string): Date {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  
  // Calculate duration from dates
  function calculateDuration() {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }
  
  // Watch for changes in props
  $effect(() => {
    if (trip) {
      title = trip.title;
      description = trip.description;
      startDate = new Date(trip.startDate);
      endDate = new Date(trip.endDate);
      budget = trip.budget;
      status = trip.status;
      type = trip.type;
      visibility = trip.visibility;
    }
  });
  
  // Watch for open prop changes
  $effect(() => {
    isOpen = open;
  });
</script>

<Dialog open={isOpen} onOpenChange={handleOpenChange}>
  <DialogContent class="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Edit Trip</DialogTitle>
      <DialogDescription>
        Update the details for your trip.
      </DialogDescription>
    </DialogHeader>
    
    <form onsubmit={(e: Event) => { e.preventDefault(); handleSubmit(); }} class="space-y-4 py-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-2">
          <Label for="title">Title</Label>
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
          <Label for="description">Description</Label>
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
            <Input 
              id="startDate" 
              type="date" 
              value={formatDate(startDate)} 
              on:change={(e) => {
                startDate = safeDateParse(e.currentTarget.value);
              }} 
              class={errors['startDate'] ? 'border-red-500' : ''}
            />
            {#if errors['startDate']}
              <p class="text-red-500 text-xs">{errors['startDate']}</p>
            {/if}
          </div>
          
          <div class="space-y-2">
            <Label for="endDate">End Date</Label>
            <Input 
              id="endDate" 
              type="date" 
              value={formatDate(endDate)} 
              on:change={(e) => {
                endDate = safeDateParse(e.currentTarget.value);
              }} 
              class={errors['endDate'] ? 'border-red-500' : ''}
            />
            {#if errors['endDate']}
              <p class="text-red-500 text-xs">{errors['endDate']}</p>
            {/if}
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="budget">Budget ($)</Label>
            <Input 
              id="budget" 
              type="number" 
              min="0" 
              step="100"
              bind:value={budget} 
              class={errors['budget'] ? 'border-red-500' : ''}
            />
            {#if errors['budget']}
              <p class="text-red-500 text-xs">{errors['budget']}</p>
            {/if}
          </div>
          
          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select selected={toSelectValue(status)} onSelectedChange={(value) => { if (value) status = fromSelectValue(value) as TripStatus; }}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {#each statusOptions as option}
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                {/each}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="type">Trip Type</Label>
            <Select selected={toSelectValue(type)} onSelectedChange={(value) => { if (value) type = fromSelectValue(value) as TripType; }}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {#each typeOptions as option}
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                {/each}
              </SelectContent>
            </Select>
          </div>
          
          <div class="space-y-2">
            <Label for="visibility">Visibility</Label>
            <Select selected={toSelectValue(visibility)} onSelectedChange={(value) => { if (value) visibility = fromSelectValue(value) as TripVisibility; }}>
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                {#each visibilityOptions as option}
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                {/each}
              </SelectContent>
            </Select>
          </div>
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
            Saving...
          {:else}
            Save Trip
          {/if}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
