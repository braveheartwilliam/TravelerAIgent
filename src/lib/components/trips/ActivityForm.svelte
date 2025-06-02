<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$lib/components/ui/tooltip';
  import { Info } from 'lucide-svelte';
  import type { Activity, Destination } from '$lib/types/trip';
  
  // Props
  const { activity = null, open = false, destinations = [] } = $props<{
    activity: Activity | null;
    open: boolean;
    destinations: Destination[];
  }>();
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    openChange: boolean;
    save: Activity;
  }>();
  
  // Form state
  let name = $state(activity?.name || '');
  let type = $state(activity?.type || 'sightseeing');
  let description = $state(activity?.description || '');
  let location = $state(activity?.location || '');
  let destinationId = $state(activity?.destinationId || (destinations.length > 0 ? destinations[0].id : ''));
  let startDate = $state<Date | undefined>(activity?.startDate ? new Date(activity?.startDate) : undefined);
  let endDate = $state<Date | undefined>(activity?.endDate ? new Date(activity?.endDate) : undefined);
  let budget = $state<number | undefined>(activity?.budget);
  let notes = $state(activity?.notes || '');
  let isLoading = $state(false);
  
  // Reset form
  function resetForm() {
    if (activity) {
      name = activity.name;
      type = activity.type;
      description = activity.description;
      location = activity.location;
      destinationId = activity.destinationId;
      startDate = activity.startDate ? new Date(activity.startDate) : undefined;
      endDate = activity.endDate ? new Date(activity.endDate) : undefined;
      budget = activity.budget;
      notes = activity.notes;
    } else {
      name = '';
      type = 'sightseeing';
      description = '';
      location = '';
      destinationId = destinations.length > 0 ? destinations[0].id : '';
      startDate = undefined;
      endDate = undefined;
      budget = undefined;
      notes = '';
    }
  }
  
  // Handle dialog open change
  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm();
    }
    dispatch('openChange', open);
  }
  
  // Handle form submission
  function handleSubmit() {
    if (!name) {
      alert('Please enter an activity name');
      return;
    }
    
    if (!startDate) {
      alert('Please select a start date');
      return;
    }
    
    if (!destinationId) {
      alert('Please select a destination');
      return;
    }
    
    const formData: Activity = {
      id: activity?.id || crypto.randomUUID(),
      name,
      type,
      description,
      location,
      destinationId,
      startDate: startDate,
      endDate: endDate || startDate,
      budget,
      notes,
      createdAt: activity?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    dispatch('save', formData);
    handleOpenChange(false);
  }
  
  // Activity types
  const activityTypes = [
    { value: 'sightseeing', label: 'Sightseeing' },
    { value: 'tour', label: 'Tour' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];
</script>

<Dialog {open} onOpenChange={handleOpenChange}>
  <DialogContent class="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>{activity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
      <DialogDescription>
        {activity 
          ? 'Update the details of your activity.' 
          : 'Add a new activity to your trip. Activities can include tours, sightseeing, dining, and more.'}
      </DialogDescription>
    </DialogHeader>
    
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label for="name">Activity Name</Label>
        <Input id="name" bind:value={name} placeholder="Enter activity name" />
      </div>
      
      <div class="grid gap-2">
        <div class="flex items-center gap-2">
          <Label for="type">Activity Type</Label>
          <TooltipProvider>
            <Tooltip text="Select the type of activity">
              <TooltipTrigger>
                <Info class="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p class="w-80">Select the type of activity you're planning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={type} onValueChange={(value) => type = value}>
          <SelectTrigger>
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            {#each activityTypes as activityType}
              <SelectItem value={activityType.value}>{activityType.label}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
      </div>
      
      <div class="grid gap-2">
        <Label for="description">Description</Label>
        <Textarea id="description" bind:value={description} placeholder="Describe the activity" />
      </div>
      
      <div class="grid gap-2">
        <Label for="destination">Destination</Label>
        <Select value={destinationId} onValueChange={(value) => destinationId = value}>
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            {#each destinations as destination}
              <SelectItem value={destination.id}>{destination.name}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
      </div>
      
      <div class="grid gap-2">
        <Label for="location">Location</Label>
        <Input id="location" bind:value={location} placeholder="Enter specific location" />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>Start Date</Label>
          <Calendar 
            mode="single" 
            selected={startDate} 
            fromDate={undefined}
            toDate={undefined}
            on:select={(e) => {
              const date = e.detail;
              if (date instanceof Date) {
                startDate = date;
                if (endDate && date > endDate) {
                  endDate = date;
                }
              }
            }} 
            initialFocus 
          />
        </div>
        
        <div class="grid gap-2">
          <Label>End Date</Label>
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
        </div>
      </div>
      
      <div class="grid gap-2">
        <Label for="budget">Budget (USD)</Label>
        <Input 
          id="budget" 
          type="number" 
          bind:value={budget} 
          placeholder="Enter budget" 
        />
      </div>
      
      <div class="grid gap-2">
        <Label for="notes">Notes</Label>
        <Textarea id="notes" bind:value={notes} placeholder="Any additional notes" />
      </div>
    </div>
    
    <DialogFooter>
      <Button variant="outline" on:click={() => handleOpenChange(false)}>Cancel</Button>
      <Button on:click={handleSubmit} disabled={isLoading}>
        {#if isLoading}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        {:else}
          Save
        {/if}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
