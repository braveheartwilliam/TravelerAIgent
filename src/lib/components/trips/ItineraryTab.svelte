<script lang="ts">
  import { Checkbox } from '$lib/components/ui/checkbox';
  import type { Trip, Destination, Transportation, Activity, Lodging } from '$lib/types/trip';
  import { formatDate } from '$lib/utils/date';
  import { createEventDispatcher } from 'svelte';

  // Define ImportedDestination type to handle the API data format
  type ImportedDestination = Destination & {
    startDate: string | Date;
    endDate: string | Date;
  };

  type ImportedTransportation = Transportation & {
    startDate: string | Date;
    endDate: string | Date;
  };

  type ImportedActivity = Activity & {
    startDate: string | Date;
    endDate: string | Date;
  };

  type ImportedLodging = Lodging & {
    checkInDate: string | Date;
    checkOutDate: string | Date;
  };

  // Props
  let { trip, isLoading = false, showTransportation = $bindable(true), showLodging = $bindable(true), showActivities = $bindable(true) } = $props();

  // Events
  const dispatch = createEventDispatcher<{
    viewDestination: { destination: Destination };
    viewTransportation: { transportation: Transportation };
    viewActivity: { activity: Activity };
    viewLodging: { lodging: Lodging };
  }>();

  // Define ItineraryItem type
  type ItineraryItem = {
    type: 'destination' | 'transportation' | 'activity' | 'lodging';
    date: Date;
    endDate?: Date;
    item: any;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
  };

  let itineraryItems: ItineraryItem[] = $state<ItineraryItem[]>([]);

  // Computed
  $effect(() => {
    // This effect will run whenever trip or the show* flags change
    buildItinerary();
  });

  function buildItinerary() {
    if (!trip) return;

    const items: ItineraryItem[] = [];

    // Add destinations
    if (trip.destinations) {
      trip.destinations.forEach((dest: any) => {
        items.push({
          type: 'destination',
          date: new Date(dest.startDate),
          endDate: new Date(dest.endDate),
          item: dest,
          title: dest.name,
          subtitle: `Arrive in ${dest.name}`,
          icon: 'map-pin',
          color: 'bg-blue-500'
        });
      });
    }

    // Add transportation if enabled
    if (showTransportation && trip.transportation) {
      trip.transportation.forEach((transport: any) => {
        items.push({
          type: 'transportation',
          date: new Date(transport.departureDateTime || transport.startDate),
          endDate: new Date(transport.arrivalDateTime || transport.endDate),
          item: transport,
          title: transport.name,
          subtitle: `${transport.departureLocation || transport.startLocation} to ${transport.arrivalLocation || transport.endLocation}`,
          icon: getTransportIcon(transport.type),
          color: 'bg-green-500'
        });
      });
    }

    // Add activities if enabled
    if (showActivities && trip.activities) {
      trip.activities.forEach((activity: any) => {
        items.push({
          type: 'activity',
          date: new Date(activity.startDate),
          endDate: new Date(activity.endDate),
          item: activity,
          title: activity.name,
          subtitle: activity.location || '',
          icon: 'calendar',
          color: 'bg-purple-500'
        });
      });
    }

    // Add lodging if enabled
    if (showLodging && trip.lodgings) {
      trip.lodgings.forEach((lodging: any) => {
        items.push({
          type: 'lodging',
          date: new Date(lodging.checkInDate),
          endDate: new Date(lodging.checkOutDate),
          item: lodging,
          title: lodging.name,
          subtitle: `Check in at ${lodging.name}`,
          icon: 'home',
          color: 'bg-amber-500'
        });
      });
    }

    // Sort by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime());

    itineraryItems = items;
  }

  function getTransportIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'flight':
      case 'air':
        return 'plane';
      case 'train':
        return 'train';
      case 'bus':
        return 'bus';
      case 'car':
      case 'land':
        return 'car';
      case 'ferry':
      case 'sea':
        return 'ship';
      default:
        return 'map';
    }
  }

  function handleItemClick(item: ItineraryItem) {
    switch (item.type) {
      case 'destination':
        dispatch('viewDestination', { destination: item.item });
        break;
      case 'transportation':
        dispatch('viewTransportation', { transportation: item.item });
        break;
      case 'activity':
        dispatch('viewActivity', { activity: item.item });
        break;
      case 'lodging':
        dispatch('viewLodging', { lodging: item.item });
        break;
    }
  }

  function formatDateWithDay(date: Date): string {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  function safeFormatDate(date: Date | undefined): string {
    if (!date) return '';
    return formatDate(date);
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Trip Itinerary</h2>
    <div class="flex items-center gap-6">
      <div class="flex items-center space-x-2">
        <Checkbox id="show-transportation" checked={showTransportation} on:change={() => showTransportation = !showTransportation} />
        <label for="show-transportation" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Transportation</label>
      </div>
      <div class="flex items-center space-x-2">
        <Checkbox id="show-lodging" checked={showLodging} on:change={() => showLodging = !showLodging} />
        <label for="show-lodging" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lodging</label>
      </div>
      <div class="flex items-center space-x-2">
        <Checkbox id="show-activities" checked={showActivities} on:change={() => showActivities = !showActivities} />
        <label for="show-activities" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Activities</label>
      </div>
    </div>
  </div>
  
  {#if isLoading}
    <div class="space-y-4">
      {#each Array(5) as _, i}
        <div class="flex gap-4">
          <div class="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-5 bg-gray-200 rounded animate-pulse w-1/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if itineraryItems.length === 0}
    <div class="text-center py-12 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      <h3 class="text-lg font-medium mb-2">No itinerary items yet</h3>
      <p class="text-gray-500 mb-4">Add destinations, transportation, activities, and lodging to build your itinerary</p>
    </div>
  {:else}
    <div class="relative">
      <!-- Timeline -->
      <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <!-- Timeline items -->
      <div class="space-y-8">
        {#each itineraryItems as item, index}
          <div class="relative flex items-start gap-4 group">
            <!-- Timeline dot -->
            <div class="h-12 w-12 rounded-full flex items-center justify-center z-10 {item.color} text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                {#if item.icon === 'map-pin'}
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                {:else if item.icon === 'plane'}
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                {:else if item.icon === 'train'}
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M4 12h16"></path><path d="M12 4v16"></path>
                {:else if item.icon === 'bus'}
                  <path d="M19 17h2l.64-2.54c.24-.959.24-1.962 0-2.92l-1.07-4.27A3 3 0 0 0 17.66 5H4a2 2 0 0 0-2 2v10h2"></path><polyline points="16 17 12 17 8 17"></polyline><circle cx="8" cy="17" r="2"></circle><circle cx="16" cy="17" r="2"></circle><path d="M4 9h16"></path><path d="M4 13h16"></path>
                {:else if item.icon === 'car'}
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path><circle cx="6.5" cy="16.5" r="2.5"></circle><circle cx="16.5" cy="16.5" r="2.5"></circle>
                {:else if item.icon === 'ship'}
                  <path d="M2 20a6 6 0 0 0 12 0c0-4-3-6-6-6-4 0-6 2-6 6Z"></path><path d="M5 20a3 3 0 0 1 6 0"></path><path d="M18 20a6 6 0 0 0 12 0c0-4-3-6-6-6-4 0-6 2-6 6Z"></path><path d="M21 20a3 3 0 0 1 6 0"></path>
                {:else if item.icon === 'calendar'}
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                {:else if item.icon === 'home'}
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
                {:else}
                  <circle cx="12" cy="12" r="10"></circle>
                {/if}
              </svg>
            </div>
            
            <!-- Content -->
            <button 
              class="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer text-left w-full" 
              onclick={() => handleItemClick(item)}
              onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(item); }}
            >
              <div class="text-sm text-gray-500 mb-1">{formatDateWithDay(item.date)}</div>
              <h3 class="text-lg font-medium">{item.title}</h3>
              <p class="text-gray-600">{item.subtitle}</p>
              
              {#if item.type === 'destination'}
                <div class="mt-2 text-sm text-gray-500">
                  {safeFormatDate(item.date)} - {safeFormatDate(item.endDate)}
                </div>
              {/if}
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
