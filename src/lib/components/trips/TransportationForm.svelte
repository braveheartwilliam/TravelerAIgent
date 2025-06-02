<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { createEventDispatcher } from 'svelte';
  import type { Transportation } from '$lib/types/trip';
  
  // Define props
  const { transportation = null, open = false, destinations = [] } = $props<{
    transportation?: Transportation | null;
    open: boolean;
    destinations: Array<{ id: string; name: string }>;
  }>();
  
  // Define events
  const dispatch = createEventDispatcher<{
    save: Transportation;
    cancel: void;
    openChange: boolean;
  }>();
  
  // Local state to track dialog open state
  let isOpen = $state(open);
  
  // Form state
  let name = $state(transportation?.name || '');
  let type = $state<'air' | 'sea' | 'land'>(transportation?.type || 'land');
  let description = $state(transportation?.description || '');
  let startDate = $state<Date | undefined>(transportation?.startDate ? new Date(transportation.startDate) : undefined);
  let endDate = $state<Date | undefined>(transportation?.endDate ? new Date(transportation.endDate) : undefined);
  let durationHours = $state(transportation?.durationHours || 1);
  let budget = $state(transportation?.budget || 0);
  let isIncluded = $state(transportation?.isIncluded || false);
  let startLocation = $state(transportation?.startLocation || '');
  let endLocation = $state(transportation?.endLocation || '');
  let confirmationNumber = $state(transportation?.confirmationNumber || '');
  
  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});
  
  // Transportation type options
  const typeOptions = [
    { value: 'air', label: 'Air' },
    { value: 'sea', label: 'Sea' },
    { value: 'land', label: 'Land' }
  ];
  
  // Validate form
  function validateForm() {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors['name'] = 'Name is required';
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
    
    if (durationHours < 0.5) {
      newErrors['durationHours'] = 'Duration must be at least 0.5 hours';
    }
    
    if (!startLocation.trim()) {
      newErrors['startLocation'] = 'Start location is required';
    }
    
    if (!endLocation.trim()) {
      newErrors['endLocation'] = 'End location is required';
    }
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  // Handle form submission
  function handleSubmit() {
    if (!validateForm()) return;
    
    isSubmitting = true;
    
    try {
      // Create transportation object
      const newTransportation: Transportation = {
        id: transportation?.id || crypto.randomUUID(),
        name,
        type,
        description,
        startDate: startDate!,
        endDate: endDate!,
        durationHours,
        budget: isIncluded ? undefined : budget,
        isIncluded,
        startLocation,
        endLocation,
        confirmationNumber: confirmationNumber || undefined
      };
      
      // Dispatch save event
      dispatch('save', newTransportation);
      
      // Close dialog
      handleOpenChange(false);
    } catch (error) {
      console.error('Failed to save transportation:', error);
      errors['submit'] = 'Failed to save transportation. Please try again.';
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
      const dateStr = date.toISOString().split('T')[0];
      return dateStr || '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }
  
  // Format time for display
  function formatTime(date: Date | undefined): string {
    if (!date) return '';
    try {
      const isoString = date.toISOString();
      const parts = isoString.split('T');
      if (parts.length > 1 && parts[1]) {
        return parts[1].substring(0, 5);
      }
      return '';
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  }
  
  // Calculate duration from dates
  function calculateDuration() {
    if (startDate && endDate) {
      try {
        const diff = endDate.getTime() - startDate.getTime();
        return Math.max(0.5, Math.round((diff / (1000 * 60 * 60)) * 2) / 2);
      } catch (error) {
        console.error('Error calculating duration:', error);
        return 1;
      }
    }
    return 1;
  }
  
  // Update end date based on duration
  function updateEndDate() {
    if (startDate) {
      try {
        const hours = Math.floor(durationHours || 1);
        const minutes = Math.round(((durationHours || 1) - hours) * 60);
        
        const newEndDate = new Date(startDate);
        newEndDate.setHours(newEndDate.getHours() + hours);
        newEndDate.setMinutes(newEndDate.getMinutes() + minutes);
        
        endDate = newEndDate;
      } catch (error) {
        console.error('Error updating end date:', error);
      }
    }
  }
  
  // Watch for changes in props
  $effect(() => {
    if (transportation) {
      name = transportation.name;
      type = transportation.type;
      description = transportation.description;
      startDate = new Date(transportation.startDate);
      endDate = new Date(transportation.endDate);
      durationHours = transportation.durationHours;
      budget = transportation.budget || 0;
      isIncluded = transportation.isIncluded || false;
      startLocation = transportation.startLocation;
      endLocation = transportation.endLocation;
      confirmationNumber = transportation.confirmationNumber || '';
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
      <DialogTitle>{transportation ? 'Edit' : 'Add'} Transportation</DialogTitle>
      <DialogDescription>
        Enter the details for this transportation between destinations.
      </DialogDescription>
    </DialogHeader>
    
    <form onsubmit={(e: Event) => { e.preventDefault(); handleSubmit(); }} class="space-y-4 py-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input 
            id="name" 
            bind:value={name} 
            placeholder="Enter transportation name" 
            class={errors['name'] ? 'border-red-500' : ''}
          />
          {#if errors['name']}
            <p class="text-red-500 text-xs">{errors['name']}</p>
          {/if}
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="type">Type</Label>
            <!-- Using a custom approach for type selection to avoid type issues -->
            <div class="relative">
              <select 
                id="type"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                bind:value={type}
              >
                <option value="" disabled>Select type</option>
                {#each typeOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
          </div>
          
          <div class="space-y-2">
            <Label for="confirmationNumber">Confirmation Number</Label>
            <Input 
              id="confirmationNumber" 
              bind:value={confirmationNumber} 
              placeholder="Enter confirmation number" 
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea 
            id="description" 
            bind:value={description} 
            placeholder="Enter transportation description" 
            class={errors['description'] ? 'border-red-500' : ''}
          />
          {#if errors['description']}
            <p class="text-red-500 text-xs">{errors['description']}</p>
          {/if}
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="startLocation">From</Label>
            <Input 
              id="startLocation" 
              bind:value={startLocation} 
              placeholder="Enter departure location" 
              class={errors['startLocation'] ? 'border-red-500' : ''}
            />
            {#if errors['startLocation']}
              <p class="text-red-500 text-xs">{errors['startLocation']}</p>
            {/if}
          </div>
          
          <div class="space-y-2">
            <Label for="endLocation">To</Label>
            <Input 
              id="endLocation" 
              bind:value={endLocation} 
              placeholder="Enter arrival location" 
              class={errors['endLocation'] ? 'border-red-500' : ''}
            />
            {#if errors['endLocation']}
              <p class="text-red-500 text-xs">{errors['endLocation']}</p>
            {/if}
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="startDate">Departure Date & Time</Label>
            <div class="grid grid-cols-2 gap-2">
              <Input 
                id="startDate" 
                type="date" 
                value={formatDate(startDate)}
                on:change={(e) => {
                  try {
                    const target = e.currentTarget as HTMLInputElement;
                    const dateStr = target.value;
                    if (dateStr) {
                      const date = new Date(dateStr);
                      if (!isNaN(date.getTime())) {
                        // Preserve time if startDate exists
                        if (startDate) {
                          const time = new Date(startDate);
                          date.setHours(time.getHours(), time.getMinutes());
                        }
                        startDate = date;
                      }
                    }
                  } catch (error) {
                    console.error('Error processing date change:', error);
                  }
                  updateEndDate();
                }} 
                class={errors['startDate'] ? 'border-red-500' : ''}
              />
              <Input 
                id="startTime" 
                type="time" 
                value={formatTime(startDate)}
                on:change={(e) => {
                  try {
                    const target = e.currentTarget as HTMLInputElement;
                    const timeStr = target.value;
                    if (timeStr && startDate) {
                      const parts = timeStr.split(':');
                      const hours = parts[0] ? Number(parts[0]) || 0 : 0;
                      const minutes = parts[1] ? Number(parts[1]) || 0 : 0;
                      const date = new Date(startDate);
                      date.setHours(hours, minutes);
                      startDate = date;
                      updateEndDate();
                    }
                  } catch (error) {
                    console.error('Error processing time change:', error);
                  }
                }}
              />
            </div>
            {#if errors['startDate']}
              <p class="text-red-500 text-xs">{errors['startDate']}</p>
            {/if}
          </div>
          
          <div class="space-y-2">
            <Label for="endDate">Arrival Date & Time</Label>
            <div class="grid grid-cols-2 gap-2">
              <Input 
                id="endDate" 
                type="date" 
                value={formatDate(endDate)}
                on:change={(e) => {
                  try {
                    const target = e.currentTarget as HTMLInputElement;
                    const dateStr = target.value;
                    if (dateStr) {
                      const date = new Date(dateStr);
                      if (!isNaN(date.getTime())) {
                        // Preserve time if endDate exists
                        if (endDate) {
                          const time = new Date(endDate);
                          date.setHours(time.getHours(), time.getMinutes());
                        }
                        endDate = date;
                      }
                    }
                  } catch (error) {
                    console.error('Error processing date change:', error);
                  }
                  calculateDuration();
                }} 
                class={errors['endDate'] ? 'border-red-500' : ''}
              />
              <Input 
                id="endTime" 
                type="time" 
                value={formatTime(endDate)}
                on:change={(e) => {
                  try {
                    const target = e.currentTarget as HTMLInputElement;
                    const timeStr = target.value;
                    if (timeStr && endDate) {
                      const parts = timeStr.split(':');
                      const hours = parts[0] ? Number(parts[0]) || 0 : 0;
                      const minutes = parts[1] ? Number(parts[1]) || 0 : 0;
                      const date = new Date(endDate);
                      date.setHours(hours, minutes);
                      endDate = date;
                      calculateDuration();
                    }
                  } catch (error) {
                    console.error('Error processing time change:', error);
                  }
                }}
              />
            </div>
            {#if errors['endDate']}
              <p class="text-red-500 text-xs">{errors['endDate']}</p>
            {/if}
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="durationHours">Duration (Hours)</Label>
            <Input 
              id="durationHours" 
              type="number" 
              min="0.5" 
              step="0.5"
              bind:value={durationHours} 
              on:change={updateEndDate}
              class={errors['durationHours'] ? 'border-red-500' : ''}
            />
            {#if errors['durationHours']}
              <p class="text-red-500 text-xs">{errors['durationHours']}</p>
            {/if}
          </div>
          
          <div class="space-y-2">
            <Label for="budget">Budget ($)</Label>
            <div class="flex items-center gap-2">
              <Input 
                id="budget" 
                type="number" 
                min="0" 
                step="0.01"
                bind:value={budget} 
                disabled={isIncluded}
                class={errors['budget'] ? 'border-red-500' : ''}
              />
            </div>
            <div class="flex items-center gap-2 mt-2">
              <Checkbox id="isIncluded" bind:checked={isIncluded} />
              <Label for="isIncluded" class="text-sm font-normal">Included in trip package</Label>
            </div>
            {#if errors['budget']}
              <p class="text-red-500 text-xs">{errors['budget']}</p>
            {/if}
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
            Save Transportation
          {/if}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
