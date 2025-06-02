import type { Trip, TripSummary, TripStatus, TripType, TripVisibility, Destination, Transportation, Activity, Lodging } from '../types/trip';
import { error } from '../utils/error';

// Mock data for development
const mockTrips: TripSummary[] = [
  {
    id: '1',
    title: 'European Adventure',
    description: 'Exploring the beautiful cities of Europe',
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-30'),
    status: 'draft',
    type: 'user-planned',
    visibility: 'private',
    destinationCount: 4,
    travelerCount: 2,
    mainDestination: 'Paris, France',
    coverImage: '/images/paris.jpg'
  },
  {
    id: '2',
    title: 'Mediterranean Cruise',
    description: 'Relaxing cruise through the Mediterranean Sea',
    startDate: new Date('2025-07-10'),
    endDate: new Date('2025-07-24'),
    status: 'in-progress',
    type: 'ship-cruise',
    visibility: 'friends',
    destinationCount: 5,
    travelerCount: 4,
    mainDestination: 'Barcelona, Spain',
    coverImage: '/images/barcelona.jpg'
  },
  {
    id: '3',
    title: 'Japan Tour',
    description: 'Guided tour through the historic sites of Japan',
    startDate: new Date('2025-09-05'),
    endDate: new Date('2025-09-20'),
    status: 'completed',
    type: 'guided-trip',
    visibility: 'public',
    destinationCount: 6,
    travelerCount: 2,
    mainDestination: 'Tokyo, Japan',
    coverImage: '/images/tokyo.jpg'
  }
];

/**
 * Options for fetching trips
 */
export interface GetTripsOptions {
  /** User ID to fetch trips for */
  userId: string;
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Search query */
  search?: string;
  /** Filter by status */
  status?: TripStatus | '';
  /** Filter by type */
  type?: TripType | '';
  /** Filter by visibility */
  visibility?: TripVisibility | '';
  /** Filter by start date (from) */
  dateFrom?: Date | string | null;
  /** Filter by end date (to) */
  dateTo?: Date | string | null;
  /** Filter by minimum budget */
  minBudget?: number;
  /** Filter by maximum budget */
  maxBudget?: number;
  /** Sort order */
  sortBy?: string;
}

/**
 * Result of a paginated trips query
 */
export interface PaginatedTripsResult {
  /** Array of trip summaries */
  trips: TripSummary[];
  /** Total number of trips matching the query */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Get archived trips with pagination and filtering
 * @param options Query options
 * @returns Paginated archived trips result
 */
export async function getArchivedTrips(options: GetTripsOptions): Promise<PaginatedTripsResult> {
  try {
    // Destructure options with defaults
    const {
      // userId is used for filtering in a real implementation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      userId,
      page = 1,
      limit = 9,
      search = '',
      type = '',
      visibility = '',
      dateFrom = null,
      dateTo = null,
      minBudget,
      maxBudget,
      sortBy = 'date-desc'
    } = options;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock archived trips data
    const archivedMockTrips: TripSummary[] = [
      {
        id: '4',
        title: 'Archived Trip to Hawaii',
        description: 'Old trip to Hawaii that was archived',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-20'),
        status: 'archived',
        type: 'user-planned',
        visibility: 'private',
        destinationCount: 2,
        travelerCount: 3,
        mainDestination: 'Honolulu, Hawaii',
        coverImage: '/images/hawaii.jpg',
        budget: 4500
      },
      {
        id: '5',
        title: 'Archived Winter Getaway',
        description: 'Skiing trip that was archived',
        startDate: new Date('2023-12-15'),
        endDate: new Date('2023-12-22'),
        status: 'archived',
        type: 'user-planned',
        visibility: 'private',
        destinationCount: 1,
        travelerCount: 4,
        mainDestination: 'Aspen, Colorado',
        coverImage: '/images/aspen.jpg',
        budget: 3800
      }
    ];

    // Apply filters (this would normally be done server-side)
    let filteredTrips = [...archivedMockTrips];
    
    // Filter by user ID in a real implementation
    // filteredTrips = filteredTrips.filter(trip => trip.userId === userId);
    
    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      filteredTrips = filteredTrips.filter(trip => 
        (trip.title?.toLowerCase().includes(query) ?? false) ||
        (trip.description?.toLowerCase().includes(query) ?? false) ||
        (trip.mainDestination?.toLowerCase().includes(query) ?? false)
      );
    }
    
    // Apply type filter
    if (type) {
      filteredTrips = filteredTrips.filter(trip => trip.type === type);
    }
    
    // Apply visibility filter
    if (visibility) {
      filteredTrips = filteredTrips.filter(trip => trip.visibility === visibility);
    }
    
    // Apply date range filter
    if (dateFrom && dateTo) {
      const fromDate = dateFrom instanceof Date ? dateFrom : new Date(dateFrom);
      const toDate = dateTo instanceof Date ? dateTo : new Date(dateTo);
      
      filteredTrips = filteredTrips.filter(trip => {
        if (!trip.startDate || !trip.endDate) return false;
        const tripStart = trip.startDate instanceof Date ? trip.startDate : new Date(trip.startDate);
        const tripEnd = trip.endDate instanceof Date ? trip.endDate : new Date(trip.endDate);
        return (
          (tripStart >= fromDate && tripStart <= toDate) || 
          (tripEnd >= fromDate && tripEnd <= toDate) ||
          (tripStart <= fromDate && tripEnd >= toDate)
        );
      });
    }
    
    // Apply budget filter
    if (minBudget !== undefined && maxBudget !== undefined) {
      filteredTrips = filteredTrips.filter(trip => {
        const budget = trip.budget || 0;
        return budget >= minBudget && budget <= maxBudget;
      });
    }
    
    // Apply sorting
    filteredTrips.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
        case 'date-desc':
          return new Date(b.startDate || '').getTime() - new Date(a.startDate || '').getTime();
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'budget-asc':
          return (a.budget || 0) - (b.budget || 0);
        case 'budget-desc':
          return (b.budget || 0) - (a.budget || 0);
        default:
          return 0;
      }
    });
    
    // Calculate pagination
    const total = filteredTrips.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrips = filteredTrips.slice(startIndex, endIndex);
    
    return {
      trips: paginatedTrips,
      total,
      page,
      limit,
      totalPages
    };
  } catch (err) {
    console.error('Error getting archived trips:', err);
    throw error({
      message: 'Failed to get archived trips. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { options }
    });
  }
}

/**
 * Get trips with pagination and filtering
 * @param options Query options or userId string
 * @returns Paginated trips result or array of trips
 */
export async function getTrips(options: GetTripsOptions | string): Promise<PaginatedTripsResult | TripSummary[]> {
  try {
    // For backward compatibility, handle string userId
    if (typeof options === 'string') {
      console.log('[getTrips] Called with userId string:', options);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return all trips for the user (old behavior)
      return {
        trips: mockTrips,
        total: mockTrips.length,
        page: 1,
        limit: mockTrips.length,
        totalPages: 1
      };
    }

    // Destructure options with defaults
    const {
      // userId is used for filtering in a real implementation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      userId,
      page = 1,
      limit = 9,
      search = '',
      status = '',
      type = '',
      visibility = '',
      dateFrom = null,
      dateTo = null,
      minBudget,
      maxBudget,
      sortBy = 'date-desc'
    } = options;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Apply filters (this would normally be done server-side)
    let filteredTrips = [...mockTrips];
    
    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      filteredTrips = filteredTrips.filter(trip => 
        (trip.title?.toLowerCase().includes(query) ?? false) ||
        (trip.description?.toLowerCase().includes(query) ?? false) ||
        (trip.mainDestination?.toLowerCase().includes(query) ?? false)
      );
    }
    
    // Apply status filter
    if (status) {
      filteredTrips = filteredTrips.filter(trip => trip.status === status);
    }
    
    // Apply type filter
    if (type) {
      filteredTrips = filteredTrips.filter(trip => trip.type === type);
    }
    
    // Apply visibility filter
    if (visibility) {
      filteredTrips = filteredTrips.filter(trip => trip.visibility === visibility);
    }
    
    // Apply date range filter
    if (dateFrom && dateTo) {
      const fromDate = dateFrom instanceof Date ? dateFrom : new Date(dateFrom);
      const toDate = dateTo instanceof Date ? dateTo : new Date(dateTo);
      
      filteredTrips = filteredTrips.filter(trip => {
        if (!trip.startDate || !trip.endDate) return false;
        const tripStart = trip.startDate instanceof Date ? trip.startDate : new Date(trip.startDate);
        const tripEnd = trip.endDate instanceof Date ? trip.endDate : new Date(trip.endDate);
        return (
          (tripStart >= fromDate && tripStart <= toDate) || 
          (tripEnd >= fromDate && tripEnd <= toDate) ||
          (tripStart <= fromDate && tripEnd >= toDate)
        );
      });
    }
    
    // Apply budget filter
    if (minBudget !== undefined && maxBudget !== undefined) {
      filteredTrips = filteredTrips.filter(trip => {
        const budget = trip.budget || 0;
        return budget >= minBudget && budget <= maxBudget;
      });
    }
    
    // Apply sorting
    filteredTrips.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
        case 'date-desc':
          return new Date(b.startDate || '').getTime() - new Date(a.startDate || '').getTime();
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'budget-asc':
          return (a.budget || 0) - (b.budget || 0);
        case 'budget-desc':
          return (b.budget || 0) - (a.budget || 0);
        default:
          return 0;
      }
    });
    
    // Calculate pagination
    const total = filteredTrips.length;
    const totalPages = Math.ceil(total / limit) || 1; // Ensure at least 1 page
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedTrips = filteredTrips.slice(startIndex, endIndex);
    
    // Return paginated result
    return {
      trips: paginatedTrips,
      total,
      page,
      limit,
      totalPages
    };
  } catch (err) {
    console.error('Error fetching trips:', err);
    throw error({
      message: 'Failed to load trips. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { options }
    });
  }
}

/**
 * Get a trip by ID
 * @param tripId Trip ID
 * @returns Trip or null if not found
 */
export async function getTripById(tripId: string): Promise<Trip | null> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real implementation, this would fetch from an API
    // For now, return mock data
    if (tripId === '1') {
      return {
        id: '1',
        title: 'European Adventure',
        description: 'Exploring the beautiful cities of Europe',
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-06-30'),
        budget: 5000,
        status: 'draft',
        type: 'user-planned',
        visibility: 'private',
        destinations: [
          {
            id: 'd1',
            name: 'Paris, France',
            address: 'Paris, France',
            latitude: 48.8566,
            longitude: 2.3522,
            description: 'The City of Light',
            startDate: new Date('2025-06-15'),
            endDate: new Date('2025-06-18'),
            durationDays: 3,
            type: 'city'
          },
          {
            id: 'd2',
            name: 'Amsterdam, Netherlands',
            address: 'Amsterdam, Netherlands',
            latitude: 52.3676,
            longitude: 4.9041,
            description: 'City of Canals',
            startDate: new Date('2025-06-19'),
            endDate: new Date('2025-06-22'),
            durationDays: 3,
            type: 'city'
          },
          {
            id: 'd3',
            name: 'Berlin, Germany',
            address: 'Berlin, Germany',
            latitude: 52.5200,
            longitude: 13.4050,
            description: 'Historic German Capital',
            startDate: new Date('2025-06-23'),
            endDate: new Date('2025-06-26'),
            durationDays: 3,
            type: 'city'
          },
          {
            id: 'd4',
            name: 'Prague, Czech Republic',
            address: 'Prague, Czech Republic',
            latitude: 50.0755,
            longitude: 14.4378,
            description: 'City of a Hundred Spires',
            startDate: new Date('2025-06-27'),
            endDate: new Date('2025-06-30'),
            durationDays: 3,
            type: 'city'
          }
        ],
        transportation: [
          {
            id: 't1',
            name: 'Flight to Paris',
            type: 'air',
            description: 'Direct flight from New York to Paris',
            startDate: new Date('2025-06-15'),
            endDate: new Date('2025-06-15'),
            durationHours: 8,
            budget: 800,
            startLocation: 'New York, USA',
            endLocation: 'Paris, France'
          },
          {
            id: 't2',
            name: 'Train to Amsterdam',
            type: 'land',
            description: 'High-speed train from Paris to Amsterdam',
            startDate: new Date('2025-06-18'),
            endDate: new Date('2025-06-18'),
            durationHours: 3.5,
            budget: 150,
            startLocation: 'Paris, France',
            endLocation: 'Amsterdam, Netherlands'
          },
          {
            id: 't3',
            name: 'Train to Berlin',
            type: 'land',
            description: 'Train from Amsterdam to Berlin',
            startDate: new Date('2025-06-22'),
            endDate: new Date('2025-06-22'),
            durationHours: 6.5,
            budget: 200,
            startLocation: 'Amsterdam, Netherlands',
            endLocation: 'Berlin, Germany'
          },
          {
            id: 't4',
            name: 'Train to Prague',
            type: 'land',
            description: 'Train from Berlin to Prague',
            startDate: new Date('2025-06-26'),
            endDate: new Date('2025-06-26'),
            durationHours: 4.5,
            budget: 120,
            startLocation: 'Berlin, Germany',
            endLocation: 'Prague, Czech Republic'
          },
          {
            id: 't5',
            name: 'Flight to New York',
            type: 'air',
            description: 'Direct flight from Prague to New York',
            startDate: new Date('2025-06-30'),
            endDate: new Date('2025-06-30'),
            durationHours: 9,
            budget: 850,
            startLocation: 'Prague, Czech Republic',
            endLocation: 'New York, USA'
          }
        ],
        activities: [],
        lodgings: [],
        travelers: [
          {
            id: 'u1',
            name: 'John Doe',
            email: 'john@example.com',
            isUser: true,
            isCreator: true,
            tripId: '1'
          },
          {
            id: 'u2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            isUser: false,
            isCreator: false,
            tripId: '1'
          }
        ],
        createdBy: 'u1',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      };
    }
    
    return null;
  } catch (err) {
    console.error('Error fetching trip:', err);
    throw error({
      message: 'Failed to fetch trip. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { tripId }
    });
  }
}

/**
 * This section was malformed and has been removed.
 * The proper createTrip function is implemented below.
 */

/**
 * Update an existing trip
 * @param tripId Trip ID
 * @param updates Trip updates
 * @returns Updated trip
 */
export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
  // In a real implementation, this would send to an API
  // For now, just return the updates as if they were applied
  return {
    ...await getTripById(tripId) as Trip,
    ...updates,
    updatedAt: new Date()
  };
}

/**
 * Create a new trip
 * @param trip Trip data
 * @param userHomeAddress User's home address (defaults to a placeholder if not provided)
 * @returns Created trip
 */
export async function createTrip(trip: Partial<Trip>, userHomeAddress?: string): Promise<Trip> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a unique ID for the trip
    const tripId = Math.random().toString(36).substring(2, 9);
    
    // Create home destinations at the start and end of the trip
    const homeAddress = userHomeAddress || '123 Home Street, Hometown';
    
    // Calculate trip duration in days
    const startDate = trip.startDate || new Date();
    const endDate = trip.endDate || new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    
    // Create starting home destination
    const startingHome: Destination = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'Home',
      address: homeAddress,
      latitude: 0, // Would be geocoded in a real implementation
      longitude: 0, // Would be geocoded in a real implementation
      description: 'Starting point',
      startDate: new Date(startDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours before trip start
      endDate: startDate,
      durationDays: 0,
      type: 'city',
      status: 'draft' as TripStatus
    };
    
    // Create ending home destination
    const endingHome: Destination = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'Home',
      address: homeAddress,
      latitude: 0, // Would be geocoded in a real implementation
      longitude: 0, // Would be geocoded in a real implementation
      description: 'Ending point',
      startDate: endDate,
      endDate: new Date(endDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours after trip end
      durationDays: 0,
      type: 'city',
      status: 'draft' as TripStatus
    };
    
    // Combine user-provided destinations with home destinations
    const destinations = [
      startingHome,
      ...(trip.destinations || []),
      endingHome
    ];
    
    // Create default transportation if none provided
    const transportation = trip.transportation || [];
    
    // If user didn't provide transportation, create default ones
    if (transportation.length === 0 && destinations.length > 1) {
      // Create transportation from home to first destination (if there are user destinations)
      if (destinations.length > 2) {
        // We've verified destinations.length > 2, so these destinations definitely exist
        const firstUserDestination = destinations[1] as Destination; // Index 1 because index 0 is startingHome
        const lastUserDestination = destinations[destinations.length - 2] as Destination; // Second to last because last is endingHome
        
        // Add transportation from home to first destination
        transportation.push({
          id: Math.random().toString(36).substring(2, 9),
          name: `Transport to ${firstUserDestination.name}`,
          type: 'land', // Default type
          description: `Transportation from Home to ${firstUserDestination.name}`,
          startDate: startingHome.endDate,
          endDate: firstUserDestination.startDate,
          durationHours: Math.max(1, (firstUserDestination.startDate.getTime() - startingHome.endDate.getTime()) / (1000 * 60 * 60)),
          startLocation: startingHome.address,
          endLocation: firstUserDestination.address,
          status: 'draft' as TripStatus
        });
        
        // Add transportation from last destination to home
        transportation.push({
          id: Math.random().toString(36).substring(2, 9),
          name: `Transport from ${lastUserDestination.name} to Home`,
          type: 'land', // Default type
          description: `Transportation from ${lastUserDestination.name} to Home`,
          startDate: lastUserDestination.endDate,
          endDate: endingHome.startDate,
          durationHours: Math.max(1, (endingHome.startDate.getTime() - lastUserDestination.endDate.getTime()) / (1000 * 60 * 60)),
          startLocation: lastUserDestination.address,
          endLocation: endingHome.address,
          status: 'draft' as TripStatus
        });
      }
    }
    
    // Create default lodgings and activities for destinations
    const lodgings = trip.lodgings || [];
    const activities = trip.activities || [];
    
    // Check each user destination (skip home destinations)
    if (destinations.length > 2) {
      for (let i = 1; i < destinations.length - 1; i++) {
        const destination = destinations[i] as Destination;
        
        // Skip if this destination already has a lodging associated with it
        const hasLodging = lodgings.some(lodging => lodging.destinationId === destination.id);
        
        if (!hasLodging) {
          // Create a default lodging for this destination
          lodgings.push({
            id: Math.random().toString(36).substring(2, 9),
            name: `Lodging in ${destination.name}`,
            type: 'hotel', // Default type
            description: `Default lodging in ${destination.name}`,
            address: destination.address,
            checkInDate: destination.startDate,
            checkOutDate: destination.endDate,
            cost: 0, // Default cost
            destinationId: destination.id,
            status: 'draft' as TripStatus,
            isScheduled: true,
            isPaid: false,
            isShared: false,
            amenities: []
          });
        }
        
        // Check if this destination already has activities associated with it
        const destinationActivities = activities.filter(activity => activity.destinationId === destination.id);
        
        // If no activities, create a default sightseeing activity
        if (destinationActivities.length === 0) {
          // Calculate a reasonable activity time (start a few hours after arrival, duration of 2 hours)
          const activityStartDate = new Date(destination.startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours after arrival
          const activityEndDate = new Date(activityStartDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
          
          activities.push({
            id: Math.random().toString(36).substring(2, 9),
            name: `Explore ${destination.name}`,
            type: 'sightseeing',
            description: `Explore and sightsee in ${destination.name}`,
            startDate: activityStartDate,
            endDate: activityEndDate,
            location: destination.address,
            destinationId: destination.id,
            status: 'draft' as TripStatus
          });
        }
      }
    }
    
    // In a real implementation, this would send to an API
    // For now, return the trip with an ID and the home destinations
    const newTrip = {
      ...trip,
      id: tripId,
      startDate,
      endDate,
      destinations,
      transportation,
      activities,
      lodgings,
      travelers: trip.travelers || [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as Trip;
    
    return newTrip;
  } catch (err) {
    console.error('Error creating trip:', err);
    throw error({
      message: 'Failed to create trip. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { trip }
    });
  }
}

/**
 * Archive a trip (soft delete)
 * @param tripId Trip ID
 * @returns Updated trip with archived status
 */
export async function archiveTrip(tripId: string): Promise<Trip> {
  try {
    // Get the current trip
    const trip = await getTripById(tripId);
    
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    // Update the trip status to 'archived'
    const updatedTrip = {
      ...trip,
      status: 'archived' as TripStatus,
      updatedAt: new Date()
    };
    
    // Update the trip
    return updateTrip(tripId, updatedTrip);
  } catch (err) {
    console.error('Error archiving trip:', err);
    throw error({
      message: 'Failed to archive trip. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { tripId }
    });
  }
}

/**
 * Restore an archived trip
 * @param tripId Trip ID
 * @param newStatus The status to restore the trip to (defaults to 'draft')
 * @returns Updated trip with restored status
 */
export async function restoreTrip(tripId: string, newStatus: TripStatus = 'draft'): Promise<Trip> {
  try {
    // Get the current trip
    const trip = await getTripById(tripId);
    
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    if (trip.status !== 'archived') {
      throw new Error('Trip is not archived');
    }
    
    // Update the trip status to the new status
    const updatedTrip = {
      ...trip,
      status: newStatus,
      updatedAt: new Date()
    };
    
    // Update the trip
    return updateTrip(tripId, updatedTrip);
  } catch (err) {
    console.error('Error restoring trip:', err);
    throw error({
      message: 'Failed to restore trip. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { tripId, newStatus }
    });
  }
}

/**
 * Permanently delete a trip
 * @param tripId Trip ID
 * @returns Success status
 */
export async function permanentlyDeleteTrip(tripId: string): Promise<boolean> {
  try {
    // Get the current trip to verify it exists
    const trip = await getTripById(tripId);
    
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    // In a real implementation, this would send to an API to permanently delete the trip
    // and all related data (destinations, transportation, activities, lodgings)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return success
    return true;
  } catch (err) {
    // Log the error and rethrow with additional context
    console.error('Error permanently deleting trip:', err);
    throw error({
      message: 'Failed to permanently delete trip. Please try again later.',
      cause: err instanceof Error ? err : new Error(String(err)),
      context: { tripId }
    });
  }
}

/**
 * Delete a trip (alias for archiveTrip for backward compatibility)
 * @param tripId Trip ID
 * @returns Success status
 * @deprecated Use archiveTrip instead
 */
export async function deleteTrip(tripId: string): Promise<boolean> {
  try {
    await archiveTrip(tripId);
    return true;
  } catch {
    // Silently fail and return false
    return false;
  }
}

/**
 * Destination management functions
 */

/**
 * Add a destination to a trip
 * @param tripId Trip ID
 * @param destination Destination data
 * @returns Updated trip
 */
export async function addDestination(tripId: string, destination: Partial<Destination>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Create a new destination with ID if not provided
  const newDestination = {
    ...destination,
    id: destination['id'] || Math.random().toString(36).substring(2, 9)
  } as Destination;
  
  // Add the destination to the trip
  const updatedTrip = {
    ...trip,
    destinations: [...trip.destinations, newDestination],
    updatedAt: new Date()
  };
  
  // Update the trip
  return updateTrip(tripId, updatedTrip);
}

/**
 * Update a destination in a trip
 * @param tripId Trip ID
 * @param destination Updated destination data
 * @returns Updated trip
 */
export async function updateDestination(tripId: string, destination: Partial<Destination>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Find the destination index
  const index = trip.destinations.findIndex(d => d.id === destination['id']);
  
  if (index === -1) {
    throw new Error('Destination not found');
  }
  
  // Update the destination
  const updatedDestinations = [...trip.destinations];
  updatedDestinations[index] = destination as Destination;
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    destinations: updatedDestinations,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Remove a destination from a trip
 * @param tripId Trip ID
 * @param destinationId Destination ID
 * @returns Updated trip
 */
export async function removeDestination(tripId: string, destinationId: string): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Filter out the destination
  const updatedDestinations = trip.destinations.filter(d => d.id !== destinationId);
  
  if (updatedDestinations.length === trip.destinations.length) {
    throw new Error('Destination not found');
  }
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    destinations: updatedDestinations,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Transportation management functions
 */

/**
 * Add transportation to a trip
 * @param tripId Trip ID
 * @param transportation Transportation data
 * @returns Updated trip
 */
export async function addTransportation(tripId: string, transportation: Partial<Transportation>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Create a new transportation with ID if not provided
  const newTransportation = {
    ...transportation,
    id: transportation['id'] || Math.random().toString(36).substring(2, 9)
  } as Transportation;
  
  // Add the transportation to the trip
  const updatedTrip = {
    ...trip,
    transportation: [...trip.transportation, newTransportation],
    updatedAt: new Date()
  };
  
  // Update the trip
  return updateTrip(tripId, updatedTrip);
}

/**
 * Update transportation in a trip
 * @param tripId Trip ID
 * @param transportation Updated transportation data
 * @returns Updated trip
 */
export async function updateTransportation(tripId: string, transportation: Partial<Transportation>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Find the transportation index
  const index = trip.transportation.findIndex(t => t.id === transportation['id']);
  
  if (index === -1) {
    throw new Error('Transportation not found');
  }
  
  // Update the transportation
  const updatedTransportation = [...trip.transportation];
  updatedTransportation[index] = transportation as Transportation;
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    transportation: updatedTransportation,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Remove transportation from a trip
 * @param tripId Trip ID
 * @param transportationId Transportation ID
 * @returns Updated trip
 */
export async function removeTransportation(tripId: string, transportationId: string): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Filter out the transportation
  const updatedTransportation = trip.transportation.filter(t => t.id !== transportationId);
  
  if (updatedTransportation.length === trip.transportation.length) {
    throw new Error('Transportation not found');
  }
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    transportation: updatedTransportation,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Activity management functions
 */

/**
 * Add an activity to a trip
 * @param tripId Trip ID
 * @param activity Activity data
 * @returns Updated trip
 */
export async function addActivity(tripId: string, activity: Partial<Activity>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Create a new activity with ID if not provided
  const newActivity = {
    ...activity,
    id: activity['id'] || Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
    updatedAt: new Date()
  } as Activity;
  
  // Add the activity to the trip
  const updatedTrip = {
    ...trip,
    activities: [...(trip.activities || []), newActivity],
    updatedAt: new Date()
  };
  
  // Update the trip
  return updateTrip(tripId, updatedTrip);
}

/**
 * Update an activity in a trip
 * @param tripId Trip ID
 * @param activity Updated activity data
 * @returns Updated trip
 */
export async function updateActivity(tripId: string, activity: Partial<Activity>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Find the activity index
  const index = trip.activities.findIndex(a => a.id === activity['id']);
  
  if (index === -1) {
    throw new Error('Activity not found');
  }
  
  // Update the activity
  const updatedActivities = [...trip.activities];
  updatedActivities[index] = {
    ...updatedActivities[index],
    ...activity,
    updatedAt: new Date()
  } as Activity;
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    activities: updatedActivities,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Remove an activity from a trip
 * @param tripId Trip ID
 * @param activityId Activity ID
 * @returns Updated trip
 */
export async function removeActivity(tripId: string, activityId: string): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Filter out the activity
  const updatedActivities = trip.activities.filter(a => a.id !== activityId);
  
  if (updatedActivities.length === trip.activities.length) {
    throw new Error('Activity not found');
  }
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    activities: updatedActivities,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Lodging management functions
 */

/**
 * Add a lodging to a trip
 * @param tripId Trip ID
 * @param lodging Lodging data
 * @returns Updated trip
 */
export async function addLodging(tripId: string, lodging: Partial<Lodging>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Create a new lodging with ID if not provided
  const newLodging = {
    ...lodging,
    id: lodging['id'] || Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
    updatedAt: new Date()
  } as Lodging;
  
  // Add the lodging to the trip
  const updatedTrip = {
    ...trip,
    lodgings: [...(trip.lodgings || []), newLodging],
    updatedAt: new Date()
  };
  
  // Update the trip
  return updateTrip(tripId, updatedTrip);
}

/**
 * Update a lodging in a trip
 * @param tripId Trip ID
 * @param lodging Updated lodging data
 * @returns Updated trip
 */
export async function updateLodging(tripId: string, lodging: Partial<Lodging>): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Find the lodging index
  const index = trip.lodgings.findIndex(l => l.id === lodging['id']);
  
  if (index === -1) {
    throw new Error('Lodging not found');
  }
  
  // Update the lodging
  const updatedLodgings = [...trip.lodgings];
  updatedLodgings[index] = {
    ...updatedLodgings[index],
    ...lodging,
    updatedAt: new Date()
  } as Lodging;
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    lodgings: updatedLodgings,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}

/**
 * Remove a lodging from a trip
 * @param tripId Trip ID
 * @param lodgingId Lodging ID
 * @returns Updated trip
 */
export async function removeLodging(tripId: string, lodgingId: string): Promise<Trip> {
  // Get the current trip
  const trip = await getTripById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }
  
  // Filter out the lodging
  const updatedLodgings = trip.lodgings.filter(l => l.id !== lodgingId);
  
  if (updatedLodgings.length === trip.lodgings.length) {
    throw new Error('Lodging not found');
  }
  
  // Update the trip
  const updatedTrip = {
    ...trip,
    lodgings: updatedLodgings,
    updatedAt: new Date()
  };
  
  return updateTrip(tripId, updatedTrip);
}
