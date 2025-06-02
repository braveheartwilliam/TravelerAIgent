<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { createEventDispatcher } from 'svelte';
  import type { Destination } from '$lib/types/trip';
  
  // Define props
  const { destination = null, open = false } = $props<{
    destination?: Destination | null;
    open: boolean;
  }>();
  
  // Define events
  const dispatch = createEventDispatcher<{
    save: Destination;
    cancel: void;
    openChange: boolean;
  }>();
  
  // Local state to track dialog open state
  let isOpen = $state(open);
  
  // Form state
  let name = $state(destination?.name || '');
  let address = $state(destination?.address || '');
  let description = $state(destination?.description || '');
  let latitude = $state(destination?.latitude || 0);
  let longitude = $state(destination?.longitude || 0);
  let startDate = $state<Date | undefined>(destination?.startDate ? new Date(destination.startDate) : undefined);
  let endDate = $state<Date | undefined>(destination?.endDate ? new Date(destination.endDate) : undefined);
  let durationDays = $state(destination?.durationDays || 1);
  let type = $state(destination?.type || 'city');
  
  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});
  
  // Destination type options
  const typeOptions = [
    { value: 'city', label: 'City' },
    { value: 'place-of-interest', label: 'Place of Interest' },
    { value: 'port', label: 'Port' }
  ];
  
  // Validate form
  function validateForm() {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors['name'] = 'Name is required';
    }
    
    if (!address.trim()) {
      newErrors['address'] = 'Address is required';
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
    
    if (durationDays < 1) {
      newErrors['durationDays'] = 'Duration must be at least 1 day';
    }
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  // Handle form submission
  function handleSubmit() {
    if (!validateForm()) return;
    
    isSubmitting = true;
    
    try {
      // Ensure dates are properly set before creating the destination object
      if (!startDate || !endDate) {
        errors['submit'] = 'Start date and end date are required';
        return;
      }
      
      // Create destination object
      const newDestination: Destination = {
        id: destination?.id || crypto.randomUUID(),
        name,
        address,
        description,
        latitude,
        longitude,
        startDate,
        endDate,
        durationDays,
        type: type
      };
      
      // Dispatch save event
      dispatch('save', newDestination);
      
      // Close dialog
      handleOpenChange(false);
    } catch (error) {
      console.error('Failed to save destination:', error);
      errors['submit'] = 'Failed to save destination. Please try again.';
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
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
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
      durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
  
  // Update end date based on duration
  function updateEndDate() {
    if (startDate && durationDays > 0) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + durationDays);
      endDate = newEndDate;
    }
  }
  
  // Watch for changes in props
  $effect(() => {
    if (destination) {
      name = destination.name;
      address = destination.address;
      description = destination.description;
      latitude = destination.latitude;
      longitude = destination.longitude;
      startDate = new Date(destination.startDate);
      endDate = new Date(destination.endDate);
      durationDays = destination.durationDays;
      type = destination.type || 'city';
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
      <DialogTitle>{destination ? 'Edit' : 'Add'} Destination</DialogTitle>
      <DialogDescription>
        Enter the details for this destination. You can add lodging and activities later.
      </DialogDescription>
    </DialogHeader>
    
    <form onsubmit={(e: Event) => { e.preventDefault(); handleSubmit(); }} class="space-y-4 py-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input 
            id="name" 
            bind:value={name} 
            placeholder="Enter destination name" 
            class={errors['name'] ? 'border-red-500' : ''}
          />
          {#if errors['name']}
            <p class="text-red-500 text-xs">{errors['name']}</p>
          {/if}
        </div>
        
        <div class="space-y-2">
          <Label for="address">Address</Label>
          <Input 
            id="address" 
            bind:value={address} 
            placeholder="Enter destination address" 
            class={errors['address'] ? 'border-red-500' : ''}
          />
          {#if errors['address']}
            <p class="text-red-500 text-xs">{errors['address']}</p>
          {/if}
        </div>
        
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea 
            id="description" 
            bind:value={description} 
            placeholder="Enter destination description" 
            class={errors['description'] ? 'border-red-500' : ''}
          />
          {#if errors['description']}
            <p class="text-red-500 text-xs">{errors['description']}</p>
          {/if}
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="latitude">Latitude</Label>
            <Input 
              id="latitude" 
              type="number" 
              step="0.000001"
              bind:value={latitude} 
              placeholder="Enter latitude" 
            />
          </div>
          
          <div class="space-y-2">
            <Label for="longitude">Longitude</Label>
            <Input 
              id="longitude" 
              type="number" 
              step="0.000001"
              bind:value={longitude} 
              placeholder="Enter longitude" 
            />
          </div>
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
                if (startDate && endDate) {
                  durationDays = calculateDuration();
                }
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
                if (startDate && endDate) {
                  durationDays = calculateDuration();
                }
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
            <Label for="durationDays">Duration (Days)</Label>
            <Input 
              id="durationDays" 
              type="number" 
              min="1" 
              bind:value={durationDays} 
              on:change={updateEndDate}
              class={errors['durationDays'] ? 'border-red-500' : ''}
            />
            {#if errors['durationDays']}
              <p class="text-red-500 text-xs">{errors['durationDays']}</p>
            {/if}
          </div>
          
          <div class="space-y-2">
            <Label for="type">Type</Label>
            <Select selected={type} onSelectedChange={(value) => { if (value) type = value as unknown as 'city' | 'place-of-interest' | 'port'; }}>
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
            Save Destination
          {/if}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
