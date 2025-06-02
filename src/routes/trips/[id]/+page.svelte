<script lang="ts">
  // UI Components
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';
  
  // Form Components
  import DestinationForm from "$lib/components/trips/DestinationForm.svelte";
  import TransportationForm from "$lib/components/trips/TransportationForm.svelte";
  import ActivityForm from "$lib/components/trips/ActivityForm.svelte";
  import LodgingForm from "$lib/components/trips/LodgingForm.svelte";
  import EditTripForm from "$lib/components/trips/EditTripForm.svelte";
  
  // Tab Components
  import DestinationsTab from "$lib/components/trips/DestinationsTab.svelte";
  import TransportationTab from "$lib/components/trips/TransportationTab.svelte";
  import ActivitiesTab from "$lib/components/trips/ActivitiesTab.svelte";
  import LodgingTab from "$lib/components/trips/LodgingTab.svelte";
  import ItineraryTab from "$lib/components/trips/ItineraryTab.svelte";
  import TripMap from "$lib/components/trips/TripMap.svelte";

  // Utils and imports
  import { formatDate, formatDateRange, calculateDurationDays } from '$lib/utils/date';
  import { page } from '$app/stores';
  import { showSuccessToast, showErrorToast } from '$lib/utils/toast';
  
  // Import base types
  import type { Trip, Destination, Transportation, Activity, Lodging, TripStatus, TripType, TripVisibility } from '$lib/types/trip';
  import type { ImportedDestination, ImportedTransportation, ImportedActivity, ImportedLodging } from '$lib/types/import';
  import { getDestinations, updateDestination } from '$lib/api/destinations';
  import { getTransportation, updateTransportation } from '$lib/api/transportation';
  import { getActivities, updateActivity } from '$lib/api/activities';
  import { getLodging, updateLodging } from '$lib/api/lodging';
  import { getTrip, updateTrip } from '$lib/api/trips';
  
  // Helper function to safely format date ranges with null checks
  function safeFormatDateRange(startDate: Date | null | undefined, endDate: Date | null | undefined): string {
    if (!startDate || !endDate) return 'No dates';
    return formatDateRange(startDate, endDate);
  }
  // Type definitions to match actual data structure
  type ExtendedDestinationType = 'city' | 'country' | 'region' | 'landmark' | 'other' | 'place-of-interest' | 'port';
  type ActivityType = 'other' | 'sightseeing' | 'tour' | 'adventure' | 'cultural' | 'entertainment' | 'food' | 'shopping' | 'relaxation' | 'sports';
  type LodgingType = 'other' | 'hotel' | 'resort' | 'airbnb' | 'hostel' | 'apartment' | 'guesthouse' | 'villa' | 'cabin' | 'camping';
  
  // Extended interfaces that match the actual data structure while being compatible with imported types
  interface ExtendedDestination {
    ['id']: string;
    ['name']: string;
    ['tripId']: string;
    ['latitude']: number;
    ['longitude']: number;
    ['startDate']: Date;
    ['endDate']: Date;
    ['description']: string;
    ['status']: TripStatus;
    ['notes']: string;
    ['address']: string;
    ['durationDays']: number;
    ['budget']: number;
    ['country']?: string;
    ['region']?: string;
    ['city']?: string;
    ['type']: 'city' | 'place-of-interest' | 'port' | 'country' | 'region' | 'landmark' | 'other';
  }
  
  interface ExtendedTransportation {
    ['id']: string;
    ['tripId']: string;
    ['name']: string;
    ['description']: string;
    ['startDate']: Date;
    ['endDate']: Date;
    ['status']: TripStatus;
    ['cost']: number;
    ['currency']: string;
    ['departureLocation']: string;
    ['arrivalLocation']: string;
    ['departureDateTime']: Date;
    ['arrivalDateTime']: Date;
    ['ticketInfo']: string;
    ['seatInfo']: string;
    ['durationHours']: number;
    ['bookingConfirmation']: string;
    ['confirmationNumber']: string;
    ['provider']: string;
    ['notes']: string;
    ['startLocation']: string;
    ['endLocation']: string;
    ['type']: 'land' | 'air' | 'sea';
    ['carrier']: string;
    ['flightNumber']: string;
    ['bookingReference']: string;
  }
  
  interface ExtendedActivity {
    ['id']: string;
    ['tripId']: string;
    ['destinationId']: string;
    ['name']: string;
    ['description']: string;
    ['location']: string;
    ['startDate']: Date;
    ['endDate']: Date;
    ['status']: TripStatus;
    ['cost']: number;
    ['currency']: string;
    ['confirmationNumber']: string;
    ['notes']: string;
    ['budget']: number;
    id: string;
    tripId: string;
    destinationId: string;
    name: string;
    type: ActivityType;
    startDate: Date;
    endDate: Date;
    description: string;
    location: string;
    cost: number;
    currency: string;
    confirmationNumber: string;
    notes: string;
    status: TripStatus;
    budget: number;
    isScheduled: boolean;
    isShared: boolean;
    isPaid: boolean;
  }
  
  interface ExtendedLodging {
    id: string;
    tripId: string;
    destinationId: string;
    name: string;
    type: LodgingType;
    description: string;
    address: string;
    checkInDate: Date;
    checkOutDate: Date;
    status: TripStatus;
    cost: number;
    currency: string;
    bookingConfirmation: string;
    confirmationNumber: string;
    notes: string;
    isScheduled: boolean;
    isShared: boolean;
    isPaid: boolean;
    roomType: string;
    amenities: string[];
  }
  
  // Helper functions for type conversion
  function asImportedDestination(destination: any): ImportedDestination {
    return {
      // Using bracket notation consistently for all properties to satisfy TypeScript index signatures
      ['id']: destination['id'] || '',
      ['tripId']: destination['tripId'] || '',
      ['name']: destination['name'] || '',
      ['type']: destination['type'] || 'city',
      ['country']: destination['country'] || '',
      ['region']: destination['region'] || '',
      ['city']: destination['city'] || '',
      ['address']: destination['address'] || '',
      ['latitude']: destination['latitude'] || 0,
      ['longitude']: destination['longitude'] || 0,
      ['startDate']: destination['startDate'] || new Date(),
      ['endDate']: destination['endDate'] || new Date(),
      ['description']: destination['description'] || '',
      ['notes']: destination['notes'] || '',
      ['status']: destination['status'] || 'planned',
      ['durationDays']: destination['durationDays'] || 0
    };
  }

  function asDestination(destination: ImportedDestination): ExtendedDestination {
    return {
      ['id']: destination['id'] || '',
      ['tripId']: destination['tripId'] || '',
      ['name']: destination['name'] || '',
      ['type']: destination['type'] || 'city',
      ['country']: destination['country'] || '',
      ['region']: destination['region'] || '',
      ['city']: destination['city'] || '',
      ['address']: destination['address'] || '',
      ['latitude']: destination['latitude'] || 0,
      ['longitude']: destination['longitude'] || 0,
      ['startDate']: destination['startDate'] || new Date(),
      ['endDate']: destination['endDate'] || new Date(),
      ['description']: destination['description'] || '',
      ['notes']: destination['notes'] || '',
      ['status']: destination['status'] || 'planned',
      ['durationDays']: destination['durationDays'] || 0,
      ['budget']: destination['budget'] || 0
    };
  }

  function asImportedTransportation(data: any): ImportedTransportation {
    // Create a complete object with all required ImportedTransportation properties
    const result: Record<string, any> = {
      id: data['id'] || '',
      tripId: data['tripId'] || '',
      name: data['name'] || '',
      type: data['type'] || 'land',
      description: data['description'] || '',
      status: data['status'] || 'planned',
      cost: data['cost'] || 0,
      currency: data['currency'] || 'USD',
      durationHours: data['durationHours'] || 0,
      isScheduled: data['isScheduled'] || false,
      isShared: data['isShared'] || false,
      isPaid: data['isPaid'] || false,
      destinationId: data['destinationId'] || '',
      carrier: data['carrier'] || '',
      flightNumber: data['flightNumber'] || '',
      bookingReference: data['bookingReference'] || '',
      provider: data['provider'] || '',
      notes: data['notes'] || '',
      ticketInfo: data['ticketInfo'] || '',
      seatInfo: data['seatInfo'] || '',
      startLocation: data['startLocation'] || '',
      endLocation: data['endLocation'] || '',
      departureLocation: data['departureLocation'] || data['startLocation'] || '',
      arrivalLocation: data['arrivalLocation'] || data['endLocation'] || '',
      startDate: data['startDate'] || new Date(),
      endDate: data['endDate'] || new Date(),
      departureDateTime: data['departureDateTime'] || data['startDate'] || new Date(),
      arrivalDateTime: data['arrivalDateTime'] || data['endDate'] || new Date(),
      confirmationNumber: data['confirmationNumber'] || '',
      bookingConfirmation: data['bookingConfirmation'] || data['confirmationNumber'] || ''
    };
    
    return result as ImportedTransportation;
  }
  
  function asTransportation(data: ImportedTransportation): ExtendedTransportation {
    // Create a base object to avoid duplicate properties
    const result: Record<string, any> = {
      id: data['id'] || '',
      tripId: data['tripId'] || '',
      name: data['name'] || '',
      type: data['type'] || 'air',
      carrier: data['carrier'] || '',
      flightNumber: data['flightNumber'] || '',
      bookingReference: data['bookingReference'] || '',
      description: data['description'] || '',
      provider: data['provider'] || '',
      confirmationNumber: data['confirmationNumber'] || '',
      notes: data['notes'] || '',
      status: data['status'] || 'planned',
      cost: data['cost'] || 0,
      currency: data['currency'] || 'USD',
      ticketInfo: data['ticketInfo'] || '',
      seatInfo: data['seatInfo'] || ''
    };
    
    // Handle properties that might have multiple sources
    // Prioritize specific properties over fallbacks
    // Use bracket notation for index signature properties
    result['startLocation'] = data['startLocation'] || '';
    result['endLocation'] = data['endLocation'] || '';
    result['departureLocation'] = data['departureLocation'] || data['startLocation'] || '';
    result['arrivalLocation'] = data['arrivalLocation'] || data['endLocation'] || '';
    result['startDate'] = data['startDate'] || new Date();
    result['endDate'] = data['endDate'] || new Date();
    result['departureDateTime'] = data['departureDateTime'] || data['startDate'] || new Date();
    result['arrivalDateTime'] = data['arrivalDateTime'] || data['endDate'] || new Date();
    result['durationHours'] = data['durationHours'] || 0;
    result['bookingConfirmation'] = data['bookingConfirmation'] || data['confirmationNumber'] || '';
    
    return result as ExtendedTransportation;
  }
  
  function asImportedActivity(data: any): ImportedActivity {
    return {
      ['id']: data['id'] || '',
      ['tripId']: data['tripId'] || '',
      ['destinationId']: data['destinationId'] || '',
      ['name']: data['name'] || '',
      ['type']: data['type'] || 'sightseeing',
      ['startDate']: data['startDate'] || new Date(),
      ['endDate']: data['endDate'] || new Date(),
      ['description']: data['description'] || '',
      ['location']: data['location'] || '',
      ['cost']: data['cost'] || 0,
      ['currency']: data['currency'] || 'USD',
      ['confirmationNumber']: data['confirmationNumber'] || '',
      ['notes']: data['notes'] || '',
      ['status']: data['status'] || 'planned',
      ['budget']: data['budget'] || 0,
      ['isScheduled']: data['isScheduled'] || false,
      ['isShared']: data['isShared'] || false,
      ['isPaid']: data['isPaid'] || false
    };
  }

  function asActivity(data: ImportedActivity): ExtendedActivity {
    return {
      ['id']: data['id'] || '',
      ['tripId']: data['tripId'] || '',
      ['destinationId']: data['destinationId'] || '',
      ['name']: data['name'] || '',
      ['type']: data['type'] || 'other',
      ['startDate']: data['startDate'] || new Date(),
      ['endDate']: data['endDate'] || new Date(),
      ['description']: data['description'] || '',
      ['location']: data['location'] || '',
      ['cost']: data['cost'] || 0,
      ['currency']: data['currency'] || 'USD',
      ['confirmationNumber']: data['confirmationNumber'] || '',
      ['notes']: data['notes'] || '',
      ['status']: data['status'] || 'planned',
      ['budget']: data['budget'] || 0,
      ['isScheduled']: data['isScheduled'] || false,
      ['isShared']: data['isShared'] || false,
      ['isPaid']: data['isPaid'] || false
    };
  }
  
  function asImportedLodging(data: any): ImportedLodging {
    return {
      ['id']: data['id'] || '',
      ['tripId']: data['tripId'] || '',
      ['destinationId']: data['destinationId'] || '',
      ['name']: data['name'] || '',
      ['type']: data['type'] || 'hotel',
      ['description']: data['description'] || '',
      ['address']: data['address'] || '',
      ['startDate']: data['startDate'] || data['checkIn'] || new Date(),
      ['endDate']: data['endDate'] || data['checkOut'] || new Date(),
      ['checkInDate']: data['checkInDate'] || data['checkIn'] || new Date(),
      ['checkOutDate']: data['checkOutDate'] || data['checkOut'] || new Date(),
      ['cost']: data['cost'] || 0,
      ['currency']: data['currency'] || 'USD',
      ['confirmationNumber']: data['confirmationNumber'] || '',
      ['bookingConfirmation']: data['bookingConfirmation'] || data['confirmationNumber'] || '',
      ['notes']: data['notes'] || '',
      ['status']: data['status'] || 'planned',
      ['isScheduled']: data['isScheduled'] || false,
      ['isShared']: data['isShared'] || false,
      ['isPaid']: data['isPaid'] || false
    };
  }
  
  function asLodging(data: ImportedLodging): ExtendedLodging {
    // Create a base object with all required ExtendedLodging properties
    // Remove startDate and endDate as they don't exist in ExtendedLodging type
    return {
      ['id']: data['id'] || '',
      ['tripId']: data['tripId'] || '',
      ['destinationId']: data['destinationId'] || '',
      ['name']: data['name'] || '',
      ['type']: data['type'] || 'hotel',
      ['description']: data['description'] || '',
      ['address']: data['address'] || '',
      // Use checkInDate and checkOutDate which are the correct properties
      // and incorporate startDate/endDate as fallbacks if available
      ['checkInDate']: data['checkInDate'] || data['checkIn'] || data['startDate'] || new Date(),
      ['checkOutDate']: data['checkOutDate'] || data['checkOut'] || data['endDate'] || new Date(),
      ['cost']: data['cost'] || 0,
      ['currency']: data['currency'] || 'USD',
      ['confirmationNumber']: data['confirmationNumber'] || '',
      ['bookingConfirmation']: data['bookingConfirmation'] || data['confirmationNumber'] || '',
      ['notes']: data['notes'] || '',
      ['status']: data['status'] || 'planned',
      ['isScheduled']: data['isScheduled'] || false,
      ['isShared']: data['isShared'] || false,
      ['isPaid']: data['isPaid'] || false,
      // Add roomType and amenities which are part of ExtendedLodging type
      ['roomType']: data['roomType'] || '',
      ['amenities']: data['amenities'] || []
    };
  }
  
  // Function to update map markers
  function updateMapMarkers() {
    // Implementation will be added later
    console.log('Updating map markers');
  }
  
  import { goto } from '$app/navigation';
  import { onMount } from "svelte";
  import { browser } from '$app/environment';
  // Types already imported above
  import { deleteTrip } from '$lib/api/trips'; // getTrip and updateTrip already imported above
  import { removeDestination, addDestination } from '$lib/api/destinations'; // getDestinations and updateDestination already imported above
  import { removeTransportation, addTransportation } from '$lib/api/transportation'; // getTransportation and updateTransportation already imported above
  import { removeActivity, addActivity } from '$lib/api/activities'; // getActivities and updateActivity already imported above
  import { removeLodging, addLodging } from '$lib/api/lodging'; // getLodging and updateLodging already imported above
  import { toast } from '$lib/components/ui/toast';

  // Additional types - imported types already declared above
  // import type { ImportedDestination, ImportedTransportation, ImportedActivity, ImportedLodging } from "$lib/types/import";
  import type { PageData } from "$lib/types/page";
  
  // UI interfaces are defined at the top of the file
  
    // UI interfaces are defined at the top of the file
  
  // Define ExtendedTrip interface
  interface ExtendedTrip {
    ['id']: string;
    ['name']: string;
    ['description']: string;
    ['startDate']: Date;
    ['endDate']: Date;
    ['status']: TripStatus;
    ['budget']: number;
    ['currency']: string;
    ['destinations']: ExtendedDestination[];
    ['transportation']: ExtendedTransportation[];
    ['activities']: ExtendedActivity[];
    ['lodgings']: ExtendedLodging[];
    ['createdAt']: Date;
    ['updatedAt']: Date;
    ['userId']: string;
    ['isPublic']: boolean;
    ['isArchived']: boolean;
    ['isDeleted']: boolean;
    ['tags']: string[];
    ['title']: string;
    ['type']: TripType;
    ['visibility']: TripVisibility;
    ['travelers']: number;
    ['createdBy']: string;
  }

  interface DestinationWithUI extends ImportedDestination {
    [key: string]: any;
  }
  
  // Extended partial interfaces for use with API calls
  interface ExtendedPartialActivity extends Partial<Activity> {
    ['tripId']?: string;
    [key: string]: any;
  }
  
  interface ExtendedPartialLodging extends Partial<Lodging> {
    ['tripId']?: string;
    [key: string]: any;
  }
  
  interface ExtendedPartialTransportation extends Partial<Transportation> {
    ['tripId']?: string;
    ['provider']?: string;
    [key: string]: any;
  }
  
  // Create a new interface instead of extending to avoid type conflicts
  interface TransportationWithUI {
    ['id']: string;
    ['tripId']: string;
    ['name']: string;
    ['type']: 'land' | 'air' | 'sea';
    ['startLocation']: string;
    ['endLocation']: string;
    ['startDate']: Date;
    ['endDate']: Date;
    ['description']: string;
    ['status']: TripStatus;
    ['cost']: number;
    ['durationHours']: number;
    ['departureDateTime']: Date;
    ['arrivalDateTime']: Date;
    ['departureLocation']: string;
    ['arrivalLocation']: string;
    ['budget']?: number;
    ['isIncluded']?: boolean;
    ['earliestArrival']?: Date;
    ['latestArrival']?: Date;
    ['earliestDeparture']?: Date;
    ['latestDeparture']?: Date;
    ['embarkationDestinationId']?: string;
    ['disembarkationDestinationId']?: string;
    ['departureTime']?: Date;
    ['arrivalTime']?: Date;
    ['carrier']: string;
    ['flightNumber']: string;
    ['bookingReference']?: string;
    ['confirmationNumber']?: string;
    ['provider']?: string;
    ['notes']?: string;
    [key: string]: any; // Index signature for additional properties
  }

  // Define tab values
  type TabValue = "itinerary" | "destinations" | "transportation" | "activities" | "map" | "lodging";
  
  // Svelte 5 props and state
  // Load trip data when the page loads
  
  // UI state
  let isLoading = $state(false);
  let trip = $state<ExtendedTrip | null>(null);
  let selectedDestination = $state<ExtendedDestination | null>(null);
  let destinations = $state<ExtendedDestination[]>([]);
  let transportation = $state<ExtendedTransportation[]>([]);
  let activities = $state<ExtendedActivity[]>([]);
  

  
  // Function to update map markers for the trip map is defined elsewhere
  let lodging = $state<ExtendedLodging[]>([]);
  let activeTab = $state<TabValue>("itinerary");
  let isDestinationFormOpen = $state(false);
  let isTransportationFormOpen = $state(false);
  let isActivityFormOpen = $state(false);
  let isLodgingFormOpen = $state(false);
  let isEditTripFormOpen = $state(false);
  let currentDestination = $state<ExtendedDestination | null>(null);
  let currentTransportation = $state<ExtendedTransportation | null>(null);
  let currentActivity = $state<ExtendedActivity | null>(null);
  let currentLodging = $state<ExtendedLodging | null>(null);
  
  // This is a duplicate function that's already defined above, removing it

  // Map state
  let mapElement: HTMLDivElement;
  let markers: any[] = $state([]);
  let routeLines: any[] = $state([]);
  let routeArrows: any[] = $state([]);
  let mapInitialized = $state(false);
  let destinationCoordinates = $state<Array<{['id']: string, ['name']: string, ['latlng']: [number, number], ['startDate']: Date}>>([]);
  
  // Helper function to safely format a date with time
  function safeFormatDateTime(date: Date | string | undefined | null): string {
    if (!date) return '';
    try {
      const d = date instanceof Date ? date : new Date(String(date));
      return d.toLocaleString();
    } catch (error) {
      return '';
    }
  }
  
  // Helper function to safely convert any value to a string
  function safeString(value: any): string {
    if (value === undefined || value === null) return '';
    return String(value);
  }
  
  // The asImportedDestination function is already defined above

  // Function to handle loading trip data
  async function loadTripData() {
    const tripId = $page.params['id'] as string;
    isLoading = true;
    try {
      // Load trip data first
      const tripData = await getTrip(tripId);
      if (tripData) {
        // Convert to unknown first to avoid type mismatch error
        trip = (tripData as unknown) as ExtendedTrip;
      } else {
        showErrorToast('Error', 'Failed to load trip data');
        return;
      }
      // Load transportation
      const transportationData = await getTransportation(tripId);
      transportation = transportationData.map(trans => {
        // Convert to proper type with bracket notation
        return {
          ['id']: trans['id'] || '',
          ['tripId']: tripId,
          ['name']: trans['name'] || '',
          ['type']: trans['type'] || 'land',
          ['startLocation']: trans['startLocation'] || '',
          ['endLocation']: trans['endLocation'] || '',
          ['startDate']: trans['startDate'] instanceof Date ? trans['startDate'] : new Date(String(trans['startDate'] || new Date())),
          ['endDate']: trans['endDate'] instanceof Date ? trans['endDate'] : new Date(String(trans['endDate'] || new Date())),
          ['description']: trans['description'] || '',
          ['provider']: (trans as any)['provider'] || '',
          ['confirmationNumber']: (trans as any)['confirmationNumber'] || '',
          ['notes']: (trans as any)['notes'] || '',
          ['status']: trans['status'] || 'confirmed'
        };
      }) as ExtendedTransportation[];

      // Load activities
      const activitiesData = await getActivities(tripId);
      activities = activitiesData.map(act => {
        // Convert to proper type with bracket notation
        return {
          ['id']: act['id'] || '',
          ['tripId']: tripId,
          ['destinationId']: act['destinationId'] || '',
          ['name']: act['name'] || '',
          ['type']: act['type'] || 'sightseeing',
          ['startDate']: act['startDate'] instanceof Date ? act['startDate'] : new Date(String(act['startDate'] || new Date())),
          ['endDate']: act['endDate'] instanceof Date ? act['endDate'] : new Date(String(act['endDate'] || new Date())),
          ['description']: act['description'] || '',
          ['location']: act['location'] || '',
          ['cost']: (act as any).cost || 0,
          ['currency']: (act as any).currency || 'USD',
          ['confirmationNumber']: (act as any).confirmationNumber || '',
          ['notes']: (act as any).notes || '',
          ['status']: act.status || 'confirmed'
        };
      }) as ExtendedActivity[];

      // Load lodging
      const lodgingData = await getLodging(tripId);
      lodging = lodgingData.map((lodge: any) => {
        // Create a complete object with all required ExtendedLodging properties
        const result: Record<string, any> = {
          id: lodge['id'] || '',
          tripId: tripId,
          destinationId: lodge['destinationId'] || '',
          name: lodge['name'] || '',
          type: lodge['type'] || 'hotel',
          description: lodge['description'] || '',
          address: lodge['address'] || '',
          cost: lodge['cost'] || 0,
          currency: lodge['currency'] || 'USD',
          status: lodge['status'] || 'confirmed',
          notes: lodge['notes'] || '',
          isScheduled: lodge['isScheduled'] || false,
          isShared: lodge['isShared'] || false,
          isPaid: lodge['isPaid'] || false,
          bookingConfirmation: lodge['bookingConfirmation'] || lodge['confirmationNumber'] || '',
          roomType: lodge['roomType'] || '',
          amenities: lodge['amenities'] || []
        };
        
        // Handle date properties with proper conversion
        result['checkInDate'] = lodge['checkInDate'] instanceof Date ? 
          lodge['checkInDate'] : 
          (lodge['checkIn'] instanceof Date ? 
            lodge['checkIn'] : 
            new Date(String(lodge['checkIn'] || lodge['checkInDate'] || new Date())));
            
        result['checkOutDate'] = lodge['checkOutDate'] instanceof Date ? 
          lodge['checkOutDate'] : 
          (lodge['checkOut'] instanceof Date ? 
            lodge['checkOut'] : 
            new Date(String(lodge['checkOut'] || lodge['checkOutDate'] || new Date())));
            
        return result as ExtendedLodging;
      });
      
      // Update map markers if function exists
      if (typeof updateMapMarkers === 'function') {
        updateMapMarkers();
      }
    } catch (error) {
      console.error('Error loading trip data:', error);
      showErrorToast('Error', 'Failed to load trip data');
    } finally {
      isLoading = false;
    }
  }

// Handle adding a new destination
async function handleAddDestination(dest: ImportedDestination) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    const importedDest = asImportedDestination({
      ...dest,
      ['tripId']: dest['tripId'] || tripId,
      ['address']: dest['address'] || '',
      ['description']: dest['description'] || '',
      ['startDate']: dest['startDate'] instanceof Date ? dest['startDate'] : new Date(String(dest['startDate'] || new Date())),
      ['endDate']: dest['endDate'] instanceof Date ? dest['endDate'] : new Date(String(dest['endDate'] || new Date())),
      ['status']: dest['status'] || 'draft',
      ['type']: dest['type'] || 'city'
    });
    await addDestination(tripId, importedDest as any);
    await loadTripData();
    showSuccessToast('Success', 'Destination added successfully');
  } catch (error) {
    console.error('Error saving destination:', error);
    showErrorToast('Error', 'Failed to save destination');
  } finally {
    isLoading = false;
  }
}

// Handle updating a destination
async function handleUpdateDestination(destination: ImportedDestination) {
  isLoading = true;
  try {
    const result = await updateDestination($page.params['id'] as string, destination as any);
    if (result) {
      // Refresh destinations
      const newDestinations = await getDestinations($page.params['id'] as string);
      if (trip) {
        trip['destinations'] = newDestinations.map(d => {
          // Convert to ImportedDestination first to ensure it has all required properties
          const importedDest = asImportedDestination({
            ...d,
            ['tripId']: $page.params['id'] as string,
            ['notes']: (d as any)['notes'] || d['description'] || ''
          });
          return asDestination(importedDest);
        }) as ExtendedDestination[];
        showSuccessToast('Destination updated', 'Your destination has been updated successfully.');
      }
    }
  } catch (error) {
    console.error('Error updating destination:', error);
    showErrorToast('Error', 'Failed to update destination');
  } finally {
    isLoading = false;
  }
}

// Handle adding a new lodging
async function handleAddLodging(lodging: ImportedLodging) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    const importedLodge = asImportedLodging({
      ...lodging,
      ['tripId']: lodging['tripId'] || tripId,
      ['checkInDate']: lodging['checkInDate'] instanceof Date ? lodging['checkInDate'] : new Date(String(lodging['checkInDate'] || new Date())),
      ['checkOutDate']: lodging['checkOutDate'] instanceof Date ? lodging['checkOutDate'] : new Date(String(lodging['checkOutDate'] || new Date())),
      ['destinationId']: lodging['destinationId'] || '',
      ['status']: lodging['status'] || 'confirmed',
      ['description']: lodging['description'] || lodging['notes'] || ''
    });
    await addLodging(tripId, importedLodge);
    await loadTripData();
    showSuccessToast('Success', 'Lodging added successfully');
  } catch (error) {
    console.error('Error saving lodging:', error);
    showErrorToast('Error', 'Failed to save lodging');
  } finally {
    isLoading = false;
  }
}

// Handle updating a lodging
async function handleUpdateLodging(lodging: ImportedLodging) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    const importedLodge = asImportedLodging({
      ...lodging,
      ['tripId']: lodging['tripId'] || tripId,
      ['checkInDate']: lodging['checkInDate'] instanceof Date ? lodging['checkInDate'] : new Date(String(lodging['checkInDate'] || new Date())),
      ['checkOutDate']: lodging['checkOutDate'] instanceof Date ? lodging['checkOutDate'] : new Date(String(lodging['checkOutDate'] || new Date())),
      ['destinationId']: lodging['destinationId'] || '',
      ['status']: lodging['status'] || 'confirmed',
      ['description']: lodging['description'] || lodging['notes'] || ''
    });
    await updateLodging(lodging['id'], importedLodge as any);
    await loadTripData();
    showSuccessToast('Success', 'Lodging updated successfully');
  } catch (error) {
    console.error('Error updating lodging:', error);
    showErrorToast('Error', 'Failed to update lodging');
  } finally {
    isLoading = false;
  }
}

// Handle saving transportation (add or update)
async function handleSaveTransportation(transportation: TransportationWithUI) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    const importedTrans = asImportedTransportation({
      ...transportation,
      ['tripId']: transportation['tripId'] || tripId,
      ['departureLocation']: transportation['startLocation'] || '',
      ['arrivalLocation']: transportation['endLocation'] || '',
      ['provider']: transportation['provider'] || '',
      ['description']: transportation['description'] || transportation['notes'] || '',
      ['startDate']: transportation['startDate'] instanceof Date ? transportation['startDate'] : new Date(String(transportation['startDate'] || new Date())),
      ['endDate']: transportation['endDate'] instanceof Date ? transportation['endDate'] : new Date(String(transportation['endDate'] || new Date())),
      ['durationHours']: transportation['durationHours'] || 0
    });
    
    if (transportation['id']) {
      // Update existing transportation
      await updateTransportation($page.params['id'] as string, importedTrans as any);
      showSuccessToast('Success', 'Transportation updated successfully');
    } else {
      // Add new transportation
      await addTransportation(tripId, importedTrans as any);
      showSuccessToast('Success', 'Transportation added successfully');
    }
    
    await loadTripData();
  } catch (error) {
    console.error('Error saving transportation:', error);
    showErrorToast('Error', 'Failed to save transportation');
  } finally {
    isLoading = false;
  }
}

// Handle adding a new activity
async function handleAddActivity(activity: ImportedActivity) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    const importedAct = asImportedActivity({
      ...activity,
      ['tripId']: activity['tripId'] || tripId,
      ['cost']: activity['budget'] || 0,
      ['startDate']: activity['startDate'] instanceof Date ? activity['startDate'] : new Date(String(activity['startDate'] || new Date())),
      ['endDate']: activity['endDate'] instanceof Date ? activity['endDate'] : new Date(String(activity['endDate'] || new Date())),
      ['description']: activity['description'] || ''
    });
    await addActivity(tripId, importedAct as any);
    await loadTripData();
    showSuccessToast('Success', 'Activity added successfully');
  } catch (error) {
    console.error('Error saving activity:', error);
    showErrorToast('Error', 'Failed to save activity');
  } finally {
    isLoading = false;
  }
}

// Handle updating an activity
async function handleUpdateActivity(activity: ImportedActivity) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    const importedAct = asImportedActivity({
      ...activity,
      ['tripId']: activity['tripId'] || tripId,
      ['cost']: activity['budget'] || 0,
      ['startDate']: activity['startDate'] instanceof Date ? activity['startDate'] : new Date(String(activity['startDate'] || new Date())),
      ['endDate']: activity['endDate'] instanceof Date ? activity['endDate'] : new Date(String(activity['endDate'] || new Date())),
      ['description']: activity['description'] || ''
    });
    await updateActivity($page.params['id'] as string, importedAct as any);
    await loadTripData();
    showSuccessToast('Success', 'Activity updated successfully');
  } catch (error) {
    console.error('Error updating activity:', error);
    showErrorToast('Error', 'Failed to update activity');
  } finally {
    isLoading = false;
  }
}

// Handle updating a trip
async function handleUpdateTrip(updatedTrip: Trip) {
  try {
    isLoading = true;
    if (!trip) {
      showErrorToast('Error', 'No trip data available');
      return;
    }
    await updateTrip(updatedTrip['id'], updatedTrip);
    showSuccessToast('Trip updated', 'Your trip has been updated successfully.');
    // Refresh the page to show the updated trip
    window.location.reload();
  } catch (error) {
    console.error('Error updating trip:', error);
    showErrorToast('Error', 'Failed to update trip');
  } finally {
    isLoading = false;
  }
}

// Handle removing a destination
async function handleRemoveDestination(destination: ImportedDestination) {
  try {
    isLoading = true;
    await removeDestination($page.params['id'] as string, destination['id']);
    await loadTripData();
    showSuccessToast('Success', 'Destination removed successfully');
  } catch (error) {
    console.error('Error removing destination:', error);
    showErrorToast('Error', 'Failed to remove destination');
  } finally {
    isLoading = false;
  }
}

// Handle removing lodging
async function handleRemoveLodging(lodging: ImportedLodging) {
  try {
    isLoading = true;
    await removeLodging($page.params['id'] as string, lodging['id']);
    await loadTripData();
    showSuccessToast('Success', 'Lodging removed successfully');
  } catch (error) {
    console.error('Error removing lodging:', error);
    showErrorToast('Error', 'Failed to remove lodging');
  } finally {
    isLoading = false;
  }
}

// Handle removing transportation
async function handleRemoveTransportation(transportation: ImportedTransportation) {
  try {
    isLoading = true;
    await removeTransportation($page.params['id'] as string, transportation['id']);
    await loadTripData();
    showSuccessToast('Success', 'Transportation removed successfully');
  } catch (error) {
    console.error('Error removing transportation:', error);
    showErrorToast('Error', 'Failed to remove transportation');
  } finally {
    isLoading = false;
  }
}

// Handle removing an activity
async function handleRemoveActivity(activity: ImportedActivity) {
  try {
    isLoading = true;
    const tripId = $page.params['id'] as string;
    await removeActivity(tripId, activity['id'] as string);
    await loadTripData();
    showSuccessToast('Success', 'Activity removed successfully');
  } catch (error) {
    console.error('Error removing activity:', error);
    showErrorToast('Error', 'Failed to remove activity');
  } finally {
    isLoading = false;
  }
}

// Handle adding a note to a destination
async function handleAddDestinationNote(destination: ExtendedDestination, note: string) {
  try {
    isLoading = true;
    // Create a new object with all properties from the original destination
    // and add/update the notes property using bracket notation
    // Cast to Record<string, any> to allow for dynamic property access
    const destinationData = destination as Record<string, any>;
    const updatedDestination = {
      ...destinationData,
      ['notes']: note
    };
    
    // Ensure we're using the correct signature for updateDestination (2 args, not 3)
    await updateDestination($page.params['id'] as string, updatedDestination as any);
    await loadTripData();
    showSuccessToast('Note added', 'Your note has been added successfully.');
  } catch (error) {
    console.error('Error adding note:', error);
    showErrorToast('Error', 'Failed to add note' as string | undefined);
  } finally {
    isLoading = false;
  }
}

// Handle adding a note to lodging
async function handleAddLodgingNote(lodging: ExtendedLodging, note: string) {
  try {
    isLoading = true;
    const updatedLodging = {
      ...lodging,
      ['notes']: note
    };
    // Combine tripId and lodging data into a single object for the API call
    const lodgingWithTripId = {
      ...updatedLodging,
      tripId: $page.params['id'] as string
    };
    await updateLodging(lodging['id'], lodgingWithTripId);
    await loadTripData();
    showSuccessToast('Note added', 'Your note has been added successfully.');
  } catch (error) {
    console.error('Error adding note:', error);
    showErrorToast('Error', 'Failed to add note' as string | undefined);
  } finally {
    isLoading = false;
  }
}

// Handle adding a note to transportation
async function handleAddTransportationNote(transportation: ExtendedTransportation, note: string) {
  try {
    isLoading = true;
    const updatedTransportation = {
      ...transportation,
      ['provider']: transportation['provider'] || '',
      ['notes']: note
    };
    await updateTransportation($page.params['id'] as string, updatedTransportation);
    await loadTripData();
    showSuccessToast('Note added', 'Your note has been added successfully.');
  } catch (error) {
    console.error('Error adding note:', error);
    showErrorToast('Error', 'Failed to add note' as string | undefined);
  } finally {
    isLoading = false;
  }
}

// Handle adding a note to activity
async function handleAddActivityNote(activity: ExtendedActivity, note: string) {
  try {
    isLoading = true;
    const updatedActivity = {
      ...activity,
      ['notes']: note
    };
    await updateActivity($page.params['id'] as string, updatedActivity);
    await loadTripData();
    showSuccessToast('Note added', 'Your note has been added successfully.');
  } catch (error) {
    console.error('Error adding note:', error);
    showErrorToast('Error', 'Failed to add note' as string | undefined);
  } finally {
    isLoading = false;
  }
}

</script>

<div class="container py-8 max-w-6xl mx-auto space-y-8">
  <!-- Trip Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold">{trip ? trip['name'] : ''}</h1>
      <p class="text-muted-foreground">{trip ? safeFormatDateRange(trip['startDate'], trip['endDate']) : 'No dates'}</p>
    </div>
    <Button variant="outline" on:click={() => isEditTripFormOpen = true}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
      Edit Trip
    </Button>
  </div>
  
  <!-- Trip Status -->
  <div class="flex items-center gap-4 bg-muted/50 p-4 rounded-lg">
    <div class="flex items-center gap-2">
      <Badge variant={trip ? (trip['status'] === 'draft' ? 'outline' : trip['status'] === 'planned' ? 'secondary' : 'default') : 'outline'}>
        {trip ? (trip['status'] === 'draft' ? 'Draft' : trip['status'] === 'planned' ? 'Planned' : 'Completed') : 'Draft'}
      </Badge>
      <span class="text-sm text-muted-foreground">{trip && trip['destinations'] ? trip['destinations'].length : 0} destinations</span>
      <span class="text-sm text-muted-foreground">•</span>
      <span class="text-sm text-muted-foreground">{trip ? calculateDurationDays(trip['startDate'], trip['endDate']) : 0} days</span>
    </div>
  </div>

  <!-- Trip Tabs -->
  <Tabs 
    value={activeTab} 
    onValueChange={(value) => {
      // Handle the value properly - if it's undefined, default to 'itinerary'
      if (value === undefined) {
        activeTab = 'itinerary' as TabValue;
      } else {
        activeTab = value as TabValue;
      }
    }}
  >
    <div class="grid grid-cols-6 w-full mb-6">
      <TabsList>
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="destinations">Destinations</TabsTrigger>
        <TabsTrigger value="transportation">Transportation</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="lodging">Lodging</TabsTrigger>
      </TabsList>
    </div>
    
    <!-- Tab content here -->
  </Tabs>

  <!-- Destination Form Dialog -->
  <DestinationForm 
    destination={currentDestination ? (asDestination(currentDestination) as Destination) : null}
    open={isDestinationFormOpen} 
    on:openChange={(e) => isDestinationFormOpen = e.detail} 
    on:save={async (e) => {
      // Cast e.detail to Record<string, any> to allow accessing any property
      const detailData = e.detail as Record<string, any>;
      const destinationData = {
        ...detailData,
        ['tripId']: $page.params['id'] || '',
        ['address']: detailData['address'] || '',
        ['description']: detailData['description'] || '',
        ['notes']: detailData['notes'] || detailData['description'] || '',
        ['startDate']: detailData['startDate'] instanceof Date ? detailData['startDate'] : new Date(String(detailData['startDate'] || new Date())),
        ['endDate']: detailData['endDate'] instanceof Date ? detailData['endDate'] : new Date(String(detailData['endDate'] || new Date())),
        ['status']: detailData['status'] || 'draft',
        ['type']: detailData['type'] || 'city',
        ['name']: detailData['name'] || '',
        ['latitude']: detailData['latitude'] || 0,
        ['longitude']: detailData['longitude'] || 0,
        ['durationDays']: detailData['durationDays'] || 0
      };
      
      if (currentDestination && currentDestination['id']) {
        // Cast destinationData to Record<string, any> to allow dynamic property access
        (destinationData as Record<string, any>)['id'] = currentDestination['id'];
        handleUpdateDestination(destinationData as ImportedDestination);
      } else {
        handleAddDestination(destinationData as ImportedDestination);
      }
    }}
  />
  
  <!-- Transportation Form Dialog -->
  <TransportationForm 
    transportation={currentTransportation ? asTransportation(currentTransportation) : null} 
    destinations={destinations as Destination[]}
    open={isTransportationFormOpen} 
    on:openChange={(e) => isTransportationFormOpen = e.detail} 
    on:save={async (e) => {
      const transportationData = {
        ...e.detail,
        ['tripId']: $page.params['id'] as string,
        ['departureLocation']: e.detail?.['startLocation'] || '',
        ['arrivalLocation']: e.detail['endLocation'] || '',
        // Using properties from our custom TransportationWithUI interface
        ['provider']: (e.detail as any)['provider'] || '',
        ['description']: e.detail['description'] || '',
        ['notes']: (e.detail as any)['notes'] || '',
        ['cost']: typeof (e.detail as any)['cost'] === 'number' ? (e.detail as any)['cost'] : 0,
        ['status']: (e.detail['status'] || 'confirmed') as TripStatus,
        ['confirmationNumber']: (e.detail as any)['confirmationNumber'] || '',
        ['startDate']: e.detail['startDate'] instanceof Date ? e.detail['startDate'] : new Date(String(e.detail['startDate'] || new Date())),
        ['endDate']: e.detail['endDate'] instanceof Date ? e.detail['endDate'] : new Date(String(e.detail['endDate'] || new Date())),
        ['durationHours']: e.detail['durationHours'] || 0,
        // Add missing required properties for TransportationWithUI interface
        ['departureDateTime']: (e.detail as any)['departureDateTime'] instanceof Date ? (e.detail as any)['departureDateTime'] : e.detail['startDate'] instanceof Date ? e.detail['startDate'] : new Date(String(e.detail['startDate'] || new Date())),
        ['arrivalDateTime']: (e.detail as any)['arrivalDateTime'] instanceof Date ? (e.detail as any)['arrivalDateTime'] : e.detail['endDate'] instanceof Date ? e.detail['endDate'] : new Date(String(e.detail['endDate'] || new Date())),
        ['carrier']: (e.detail as any)['carrier'] || '',
        ['flightNumber']: (e.detail as any)['flightNumber'] || ''
      };
      
      if (currentTransportation && currentTransportation['id']) {
        transportationData['id'] = currentTransportation['id'];
        handleSaveTransportation(transportationData as TransportationWithUI);
      } else {
        handleSaveTransportation(transportationData as TransportationWithUI);
      }
    }}
  />
  
  <!-- Activity Form Dialog -->
  <ActivityForm 
    activity={currentActivity ? asActivity(currentActivity) : null} 
    open={isActivityFormOpen} 
    destinations={trip ? (trip['destinations'] as Destination[]) : []}
    on:openChange={(e) => isActivityFormOpen = e.detail} 
    on:save={async (e) => {
      // Ensure tripId is always a string by using a non-null assertion or default empty string
      const tripId = $page.params['id'] || '';
      
      const activityData = {
        ...e.detail,
        ['tripId']: tripId, // Now tripId is guaranteed to be a string
        ['destinationId']: e.detail['destinationId'] || '',
        ['startDate']: e.detail['startDate'] instanceof Date ? e.detail['startDate'] : new Date(String(e.detail['startDate'] || new Date())),
        ['endDate']: e.detail['endDate'] instanceof Date ? e.detail['endDate'] : new Date(String(e.detail['endDate'] || new Date())),
        ['description']: e.detail['description'] || e.detail['notes'] || ''
      };
      
      if (currentActivity && currentActivity['id']) {
        activityData['id'] = currentActivity['id'];
        handleUpdateActivity(activityData as ImportedActivity); // Add type assertion
      } else {
        handleAddActivity(activityData as ImportedActivity); // Add type assertion
      }
    }}
  />
  
  <!-- Lodging Form Dialog -->
  <LodgingForm 
    lodging={currentLodging ? asLodging(currentLodging) : null} 
    open={isLodgingFormOpen} 
    destinations={trip ? (trip['destinations'] as Destination[]) : []}
    on:openChange={(e) => isLodgingFormOpen = e.detail} 
    on:save={async (e) => {
      // Ensure tripId is always a string by using a default empty string
      const tripId = $page.params['id'] || '';
      
      const lodgingData = {
        ...e.detail,
        ['tripId']: tripId, // Now tripId is guaranteed to be a string
        ['destinationId']: e.detail['destinationId'] || '',
        ['checkInDate']: e.detail['checkInDate'] instanceof Date ? e.detail['checkInDate'] : new Date(String(e.detail['checkInDate'] || new Date())),
        ['checkOutDate']: e.detail['checkOutDate'] instanceof Date ? e.detail['checkOutDate'] : new Date(String(e.detail['checkOutDate'] || new Date())),
        ['description']: e.detail['description'] || e.detail['notes'] || ''
      };
      
      if (currentLodging && currentLodging['id']) {
        lodgingData['id'] = currentLodging['id'];
        handleUpdateLodging(lodgingData as ImportedLodging); // Add type assertion
      } else {
        handleAddLodging(lodgingData as ImportedLodging); // Add type assertion
      }
    }}
  />
  
  <!-- Edit Trip Form Dialog -->
  <EditTripForm 
    trip={trip as Trip | null} 
    open={isEditTripFormOpen} 
    on:openChange={(e) => isEditTripFormOpen = e.detail} 
    on:save={async (e) => {
      isLoading = true;
      try {
        await updateTrip(trip ? trip['id'] : '', e.detail as Trip);
        showSuccessToast('Trip updated', 'Your trip has been updated successfully.');
        // Refresh the page to show the updated trip
        window.location.reload();
      } catch (error) {
        console.error('Failed to update trip:', error);
        showErrorToast('Error', 'Failed to update trip. Please try again.');
      } finally {
        isLoading = false;
      }
    }}
  />
</div>
