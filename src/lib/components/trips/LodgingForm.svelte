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
  import type { Lodging, Destination } from '$lib/types/trip';
  
  // Props
  const { lodging = null, open = false, destinations = [] } = $props<{
    lodging: Lodging | null;
    open: boolean;
    destinations: Destination[];
  }>();
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    openChange: boolean;
    save: Lodging;
  }>();
  
  // Form state
  let name = $state(lodging?.name || '');
  let type = $state(lodging?.type || 'hotel');
  let description = $state(lodging?.description || '');
  let address = $state(lodging?.address || '');
  let destinationId = $state(lodging?.destinationId || (destinations.length > 0 ? destinations[0].id : ''));
  let checkInDate = $state<Date | undefined>(lodging?.checkInDate ? new Date(lodging?.checkInDate) : undefined);
  let checkOutDate = $state<Date | undefined>(lodging?.checkOutDate ? new Date(lodging?.checkOutDate) : undefined);
  let cost = $state<number | undefined>(lodging?.cost);
  let roomType = $state(lodging?.roomType || '');
  let amenities = $state(lodging?.amenities || []);
  let bookingConfirmation = $state(lodging?.bookingConfirmation || '');
  let notes = $state(lodging?.notes || '');
  let isLoading = $state(false);
  
  // Reset form
  function resetForm() {
    if (lodging) {
      name = lodging.name;
      type = lodging.type;
      description = lodging.description;
      address = lodging.address;
      destinationId = lodging.destinationId;
      checkInDate = lodging.checkInDate ? new Date(lodging.checkInDate) : undefined;
      checkOutDate = lodging.checkOutDate ? new Date(lodging.checkOutDate) : undefined;
      cost = lodging.cost;
      roomType = lodging.roomType || '';
      amenities = lodging.amenities || [];
      bookingConfirmation = lodging.bookingConfirmation || '';
      notes = lodging.notes || '';
    } else {
      name = '';
      type = 'hotel';
      description = '';
      address = '';
      destinationId = destinations.length > 0 ? destinations[0].id : '';
      checkInDate = undefined;
      checkOutDate = undefined;
      cost = undefined;
      roomType = '';
      amenities = [];
      bookingConfirmation = '';
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
      alert('Please enter a lodging name');
      return;
    }
    
    if (!checkInDate) {
      alert('Please select a check-in date');
      return;
    }
    
    if (!destinationId) {
      alert('Please select a destination');
      return;
    }
    
    const formData: Lodging = {
      id: lodging?.id || crypto.randomUUID(),
      name,
      type,
      description,
      address,
      destinationId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate || checkInDate,
      cost,
      roomType,
      amenities,
      bookingConfirmation,
      notes,
      createdAt: lodging?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    dispatch('save', formData);
    handleOpenChange(false);
  }
  
  // Lodging types
  const lodgingTypes = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'airbnb', label: 'Airbnb' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'guesthouse', label: 'Guesthouse' },
    { value: 'villa', label: 'Villa' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'camping', label: 'Camping' },
    { value: 'other', label: 'Other' }
  ];
  
  // Handle amenities input
  function handleAmenitiesChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    amenities = value.split(',').map(item => item.trim()).filter(Boolean);
  }
</script>

<Dialog {open} onOpenChange={handleOpenChange}>
  <DialogContent class="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>{lodging ? 'Edit Lodging' : 'Add Lodging'}</DialogTitle>
      <DialogDescription>
        {lodging 
          ? 'Update the details of your lodging.' 
          : 'Add a new lodging to your trip. This can be a hotel, Airbnb, resort, or any other accommodation.'}
      </DialogDescription>
    </DialogHeader>
    
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label for="name">Lodging Name</Label>
        <Input id="name" bind:value={name} placeholder="Enter lodging name" />
      </div>
      
      <div class="grid gap-2">
        <div class="flex items-center gap-2">
          <Label for="type">Lodging Type</Label>
          <TooltipProvider>
            <Tooltip text="Select the type of lodging">
              <TooltipTrigger>
                <Info class="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p class="w-80">Select the type of lodging you're planning to stay at</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={type} onValueChange={(value) => type = value}>
          <SelectTrigger>
            <SelectValue placeholder="Select lodging type" />
          </SelectTrigger>
          <SelectContent>
            {#each lodgingTypes as lodgingType}
              <SelectItem value={lodgingType.value}>{lodgingType.label}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
      </div>
      
      <div class="grid gap-2">
        <Label for="description">Description</Label>
        <Textarea id="description" bind:value={description} placeholder="Describe the lodging" />
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
        <Label for="address">Address</Label>
        <Input id="address" bind:value={address} placeholder="Enter address" />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>Check-in Date</Label>
          <Calendar 
            mode="single" 
            selected={checkInDate} 
            fromDate={undefined}
            toDate={undefined}
            on:select={(e) => {
              const date = e.detail;
              if (date instanceof Date) {
                checkInDate = date;
                if (checkOutDate && date > checkOutDate) {
                  checkOutDate = date;
                }
              }
            }} 
            initialFocus 
          />
        </div>
        
        <div class="grid gap-2">
          <Label>Check-out Date</Label>
          <Calendar 
            mode="single" 
            selected={checkOutDate} 
            fromDate={checkInDate}
            toDate={undefined}
            on:select={(e) => {
              const date = e.detail;
              if (date instanceof Date) {
                checkOutDate = date;
              }
            }} 
            initialFocus 
          />
        </div>
      </div>
      
      <div class="grid gap-2">
        <Label for="cost">Cost (USD)</Label>
        <Input 
          id="cost" 
          type="number" 
          bind:value={cost} 
          placeholder="Enter total cost" 
        />
      </div>
      
      <div class="grid gap-2">
        <Label for="roomType">Room Type</Label>
        <Input id="roomType" bind:value={roomType} placeholder="e.g., Standard Double, Suite" />
      </div>
      
      <div class="grid gap-2">
        <Label for="amenities">Amenities</Label>
        <Input 
          id="amenities" 
          value={amenities.join(', ')} 
          on:input={handleAmenitiesChange}
          placeholder="e.g., WiFi, Pool, Breakfast (comma separated)" 
        />
      </div>
      
      <div class="grid gap-2">
        <Label for="bookingConfirmation">Booking Confirmation #</Label>
        <Input id="bookingConfirmation" bind:value={bookingConfirmation} placeholder="Enter booking confirmation number" />
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
