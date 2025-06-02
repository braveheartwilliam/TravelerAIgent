import { db } from '$lib/server/db';
import { eq, and, asc, desc, inArray, isNull, isNotNull, gte, lte, like, sql } from 'drizzle-orm';
import {
  trips,
  destinations,
  transportation,
  lodging,
  activities,
  travelers,
  tripSharing,
  paymentSchedules
} from '$lib/server/schema.updated';
import {
  mapDbTrip,
  mapToDbTrip,
  mapDbDestination,
  mapToDbDestination,
  mapDbTransportation,
  mapToDbTransportation,
  mapDbLodging,
  mapToDbLodging,
  mapDbActivity,
  mapToDbActivity,
  mapDbPaymentSchedule,
  mapToDbPaymentSchedule
} from './utils';
import type {
  Trip,
  Destination,
  Transportation,
  Lodging,
  Activity,
  Traveler,
  TripSharing,
  PaymentSchedule,
  NewTrip,
  NewDestination,
  NewTransportation,
  NewLodging,
  NewActivity,
  NewTraveler,
  NewTripSharing,
  NewPaymentSchedule,
  TripStatus,
  TripType,
  TripVisibility
} from '$lib/types/trips';

/**
 * Trip Repository
 * Provides functions for interacting with trip-related entities in the database
 */

// Trip functions
export async function getAllTrips(userId: number): Promise<Trip[]> {
  const dbTrips = await db.select().from(trips)
    .where(eq(trips.user_id, userId))
    .orderBy(desc(trips.created_at));
  
  return dbTrips.map(mapDbTrip);
}

export async function getTripById(tripId: number): Promise<Trip | undefined> {
  const result = await db.select().from(trips)
    .where(eq(trips.id, tripId))
    .limit(1);
  
  return result[0] ? mapDbTrip(result[0]) : undefined;
}

export async function getTripsByStatus(userId: number, status: TripStatus): Promise<Trip[]> {
  const dbTrips = await db.select().from(trips)
    .where(and(
      eq(trips.user_id, userId),
      eq(trips.status, status)
    ))
    .orderBy(desc(trips.created_at));
  
  return dbTrips.map(mapDbTrip);
}

export async function getTripsByType(userId: number, type: TripType): Promise<Trip[]> {
  const dbTrips = await db.select().from(trips)
    .where(and(
      eq(trips.user_id, userId),
      eq(trips.type, type)
    ))
    .orderBy(desc(trips.created_at));
  
  return dbTrips.map(mapDbTrip);
}

export async function getSharedTrips(userId: number): Promise<Trip[]> {
  const sharedTripIds = await db.select({ tripId: tripSharing.trip_id })
    .from(tripSharing)
    .where(eq(tripSharing.user_id, userId));
  
  if (sharedTripIds.length === 0) {
    return [];
  }
  
  const dbTrips = await db.select().from(trips)
    .where(inArray(trips.id, sharedTripIds.map(t => t.tripId)))
    .orderBy(desc(trips.created_at));
  
  return dbTrips.map(mapDbTrip);
}

export async function getPublicTrips(): Promise<Trip[]> {
  const dbTrips = await db.select().from(trips)
    .where(eq(trips.visibility, 'public'))
    .orderBy(desc(trips.created_at));
  
  return dbTrips.map(mapDbTrip);
}

export async function createTrip(newTrip: NewTrip): Promise<Trip> {
  // Create a database-compatible object with string values for numeric fields
  const dbTrip = {
    ...newTrip,
    budget_planned: newTrip.budget_planned !== null ? newTrip.budget_planned.toString() : null,
    budget_actual: newTrip.budget_actual !== null ? newTrip.budget_actual.toString() : null
  };
  
  const result = await db.insert(trips).values(dbTrip).returning();
  return mapDbTrip(result[0]);
}

export async function updateTrip(id: number, tripData: Partial<Trip>): Promise<Trip> {
  // Create a database-compatible object with string values for numeric fields
  const dbTrip: Record<string, any> = {};
  
  // Only copy fields that are present in tripData
  Object.keys(tripData).forEach(key => {
    if (key === 'budget_planned' || key === 'budget_actual') {
      // Convert numeric fields to strings
      const value = tripData[key as keyof Partial<Trip>];
      dbTrip[key] = value !== null && value !== undefined ? value.toString() : null;
    } else {
      // Copy other fields as is
      dbTrip[key] = tripData[key as keyof Partial<Trip>];
    }
  });
  
  const result = await db.update(trips).set(dbTrip).where(eq(trips.id, id)).returning();
  return mapDbTrip(result[0]);
}

export async function deleteTrip(tripId: number): Promise<boolean> {
  const result = await db.delete(trips)
    .where(eq(trips.id, tripId))
    .returning({ id: trips.id });
  
  return result.length > 0;
}

// Destination functions
export async function getDestinationsByTripId(tripId: number): Promise<Destination[]> {
  const dbDestinations = await db.select().from(destinations)
    .where(eq(destinations.trip_id, tripId))
    .orderBy(asc(destinations.order_index));
  
  return dbDestinations.map(mapDbDestination);
}

export async function getDestinationById(destinationId: number): Promise<Destination | undefined> {
  const result = await db.select().from(destinations)
    .where(eq(destinations.id, destinationId))
    .limit(1);
  
  return result[0] ? mapDbDestination(result[0]) : undefined;
}

export async function createDestination(newDestination: NewDestination): Promise<Destination> {
  // Create a database-compatible object with string values for numeric fields
  const dbDestination = {
    ...newDestination,
    latitude: newDestination.latitude !== null ? newDestination.latitude.toString() : null,
    longitude: newDestination.longitude !== null ? newDestination.longitude.toString() : null,
    budget_planned: newDestination.budget_planned !== null ? newDestination.budget_planned.toString() : null,
    budget_actual: newDestination.budget_actual !== null ? newDestination.budget_actual.toString() : null,
    is_start_location: newDestination.is_start_location ?? false,
    is_end_location: newDestination.is_end_location ?? false
  };
  
  const result = await db.insert(destinations).values(dbDestination).returning();
  return mapDbDestination(result[0]);
}

export async function updateDestination(id: number, destinationData: Partial<Destination>): Promise<Destination> {
  // Create a database-compatible object with string values for numeric fields
  const dbDestination: Record<string, any> = {};
  
  // Only copy fields that are present in destinationData
  Object.keys(destinationData).forEach(key => {
    if (key === 'latitude' || key === 'longitude' || key === 'budget_planned' || key === 'budget_actual') {
      // Convert numeric fields to strings
      const value = destinationData[key as keyof Partial<Destination>];
      dbDestination[key] = value !== null && value !== undefined ? value.toString() : null;
    } else if (key === 'is_start_location' || key === 'is_end_location') {
      // Handle boolean fields
      const value = destinationData[key as keyof Partial<Destination>];
      dbDestination[key] = value ?? false;
    } else {
      // Copy other fields as is
      dbDestination[key] = destinationData[key as keyof Partial<Destination>];
    }
  });
  
  const result = await db.update(destinations).set(dbDestination).where(eq(destinations.id, id)).returning();
  return mapDbDestination(result[0]);
}

export async function deleteDestination(destinationId: number): Promise<boolean> {
  const result = await db.delete(destinations)
    .where(eq(destinations.id, destinationId))
    .returning({ id: destinations.id });
  
  return result.length > 0;
}

export async function reorderDestinations(tripId: number, destinationIds: number[]): Promise<boolean> {
  // Start a transaction to ensure all updates succeed or fail together
  return await db.transaction(async (tx) => {
    for (let i = 0; i < destinationIds.length; i++) {
      await tx.update(destinations)
        .set({ order_index: i })
        .where(and(
          eq(destinations.id, destinationIds[i]),
          eq(destinations.trip_id, tripId)
        ));
    }
    return true;
  });
}

// Transportation functions
export async function getTransportationByTripId(tripId: number): Promise<Transportation[]> {
  const dbTransportation = await db.select().from(transportation)
    .where(eq(transportation.trip_id, tripId))
    .orderBy(asc(transportation.departure_date));
  
  return dbTransportation.map(mapDbTransportation);
}

export async function getTransportationById(transportationId: number): Promise<Transportation | undefined> {
  const result = await db.select().from(transportation)
    .where(eq(transportation.id, transportationId))
    .limit(1);
  
  return result[0] ? mapDbTransportation(result[0]) : undefined;
}

export async function getTransportationByDestination(destinationId: number, direction: 'from' | 'to'): Promise<Transportation[]> {
  let dbTransportation;
  if (direction === 'from') {
    dbTransportation = await db.select().from(transportation)
      .where(eq(transportation.from_destination_id, destinationId))
      .orderBy(asc(transportation.departure_date));
  } else {
    dbTransportation = await db.select().from(transportation)
      .where(eq(transportation.to_destination_id, destinationId))
      .orderBy(asc(transportation.arrival_date));
  }
  
  return dbTransportation.map(mapDbTransportation);
}

export async function createTransportation(newTransportation: NewTransportation): Promise<Transportation> {
  // Create a database-compatible object with string values for numeric fields
  const dbTransportation = {
    ...newTransportation,
    duration_hours: newTransportation.duration_hours !== null ? newTransportation.duration_hours.toString() : null,
    fare: newTransportation.fare !== null ? newTransportation.fare.toString() : null,
    is_shared: newTransportation.is_shared ?? false,
    is_private: newTransportation.is_private ?? false,
    is_paid: newTransportation.is_paid ?? false,
    is_scheduled: newTransportation.is_scheduled ?? false
  };
  
  const result = await db.insert(transportation).values(dbTransportation).returning();
  return mapDbTransportation(result[0]);
}

export async function updateTransportation(id: number, transportationData: Partial<Transportation>): Promise<Transportation> {
  // Create a database-compatible object with string values for numeric fields
  const dbTransportation: Record<string, any> = {};
  
  // Only copy fields that are present in transportationData
  Object.keys(transportationData).forEach(key => {
    if (key === 'duration_hours' || key === 'fare') {
      // Convert numeric fields to strings
      const value = transportationData[key as keyof Partial<Transportation>];
      dbTransportation[key] = value !== null && value !== undefined ? value.toString() : null;
    } else if (key === 'is_shared' || key === 'is_private' || key === 'is_paid' || key === 'is_scheduled') {
      // Handle boolean fields
      const value = transportationData[key as keyof Partial<Transportation>];
      dbTransportation[key] = value ?? false;
    } else {
      // Copy other fields as is
      dbTransportation[key] = transportationData[key as keyof Partial<Transportation>];
    }
  });
  
  const result = await db.update(transportation).set(dbTransportation).where(eq(transportation.id, id)).returning();
  return mapDbTransportation(result[0]);
}

export async function deleteTransportation(transportationId: number): Promise<boolean> {
  const result = await db.delete(transportation)
    .where(eq(transportation.id, transportationId))
    .returning({ id: transportation.id });
  
  return result.length > 0;
}

// Lodging functions
export async function getLodgingByTripId(tripId: number): Promise<Lodging[]> {
  const dbLodging = await db.select().from(lodging)
    .where(eq(lodging.trip_id, tripId))
    .orderBy(asc(lodging.arrival_date));
  
  return dbLodging.map(mapDbLodging);
}

export async function getLodgingById(lodgingId: number): Promise<Lodging | undefined> {
  const result = await db.select().from(lodging)
    .where(eq(lodging.id, lodgingId))
    .limit(1);
  
  return result[0] ? mapDbLodging(result[0]) : undefined;
}

export async function getLodgingByDestination(destinationId: number): Promise<Lodging | undefined> {
  const result = await db.select().from(lodging)
    .where(eq(lodging.destination_id, destinationId))
    .limit(1);
  
  return result[0] ? mapDbLodging(result[0]) : undefined;
}

export async function createLodging(newLodging: NewLodging): Promise<Lodging> {
  // Create a database-compatible object with string values for numeric fields
  const dbLodging = {
    ...newLodging,
    latitude: newLodging.latitude !== null ? newLodging.latitude.toString() : null,
    longitude: newLodging.longitude !== null ? newLodging.longitude.toString() : null,
    cost_per_night: newLodging.cost_per_night !== null ? newLodging.cost_per_night.toString() : null,
    total_cost: newLodging.total_cost !== null ? newLodging.total_cost.toString() : null,
    is_shared: newLodging.is_shared ?? false,
    is_private: newLodging.is_private ?? false,
    is_paid: newLodging.is_paid ?? false,
    is_scheduled: newLodging.is_scheduled ?? false
  };
  
  const result = await db.insert(lodging).values(dbLodging).returning();
  return mapDbLodging(result[0]);
}

export async function updateLodging(id: number, lodgingData: Partial<Lodging>): Promise<Lodging> {
  // Create a database-compatible object with string values for numeric fields
  const dbLodging: Record<string, any> = {};
  
  // Only copy fields that are present in lodgingData
  Object.keys(lodgingData).forEach(key => {
    if (key === 'latitude' || key === 'longitude' || key === 'cost_per_night' || key === 'total_cost') {
      // Convert numeric fields to strings
      const value = lodgingData[key as keyof Partial<Lodging>];
      dbLodging[key] = value !== null && value !== undefined ? value.toString() : null;
    } else if (key === 'is_shared' || key === 'is_private' || key === 'is_paid' || key === 'is_scheduled') {
      // Handle boolean fields
      const value = lodgingData[key as keyof Partial<Lodging>];
      dbLodging[key] = value ?? false;
    } else {
      // Copy other fields as is
      dbLodging[key] = lodgingData[key as keyof Partial<Lodging>];
    }
  });
  
  const result = await db.update(lodging).set(dbLodging).where(eq(lodging.id, id)).returning();
  return mapDbLodging(result[0]);
}

export async function deleteLodging(lodgingId: number): Promise<boolean> {
  const result = await db.delete(lodging)
    .where(eq(lodging.id, lodgingId))
    .returning({ id: lodging.id });
  
  return result.length > 0;
}

// Activity functions
export async function getActivitiesByTripId(tripId: number): Promise<Activity[]> {
  const dbActivities = await db.select().from(activities)
    .where(eq(activities.trip_id, tripId))
    .orderBy(asc(activities.start_date));
  
  return dbActivities.map(mapDbActivity);
}

export async function getActivitiesByDestination(destinationId: number): Promise<Activity[]> {
  const dbActivities = await db.select().from(activities)
    .where(eq(activities.destination_id, destinationId))
    .orderBy(asc(activities.start_date));
  
  return dbActivities.map(mapDbActivity);
}

export async function getActivityById(activityId: number): Promise<Activity | undefined> {
  const result = await db.select().from(activities)
    .where(eq(activities.id, activityId))
    .limit(1);
  
  return result[0] ? mapDbActivity(result[0]) : undefined;
}

export async function createActivity(newActivity: NewActivity): Promise<Activity> {
  // Create a database-compatible object with string values for numeric fields
  const dbActivity = {
    ...newActivity,
    latitude: newActivity.latitude !== null ? newActivity.latitude.toString() : null,
    longitude: newActivity.longitude !== null ? newActivity.longitude.toString() : null,
    cost: newActivity.cost !== null ? newActivity.cost.toString() : null,
    duration_hours: newActivity.duration_hours !== null ? newActivity.duration_hours.toString() : null,
    is_shared: newActivity.is_shared ?? false,
    is_private: newActivity.is_private ?? false,
    is_paid: newActivity.is_paid ?? false,
    is_scheduled: newActivity.is_scheduled ?? false
  };
  
  const result = await db.insert(activities).values(dbActivity).returning();
  return mapDbActivity(result[0]);
}

export async function updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity> {
  // Create a database-compatible object with string values for numeric fields
  const dbActivity: Record<string, any> = {};
  
  // Only copy fields that are present in activityData
  Object.keys(activityData).forEach(key => {
    if (key === 'latitude' || key === 'longitude' || key === 'cost' || key === 'duration_hours') {
      // Convert numeric fields to strings
      const value = activityData[key as keyof Partial<Activity>];
      dbActivity[key] = value !== null && value !== undefined ? value.toString() : null;
    } else if (key === 'is_shared' || key === 'is_private' || key === 'is_paid' || key === 'is_scheduled') {
      // Handle boolean fields
      const value = activityData[key as keyof Partial<Activity>];
      dbActivity[key] = value ?? false;
    } else {
      // Copy other fields as is
      dbActivity[key] = activityData[key as keyof Partial<Activity>];
    }
  });
  
  const result = await db.update(activities).set(dbActivity).where(eq(activities.id, id)).returning();
  return mapDbActivity(result[0]);
}

export async function deleteActivity(activityId: number): Promise<boolean> {
  const result = await db.delete(activities)
    .where(eq(activities.id, activityId))
    .returning({ id: activities.id });
  
  return result.length > 0;
}

// Traveler functions
export async function getTravelersByTripId(tripId: number): Promise<Traveler[]> {
  return await db.select().from(travelers)
    .where(eq(travelers.trip_id, tripId))
    .orderBy(desc(travelers.is_trip_creator), asc(travelers.name));
}

export async function getTravelerById(travelerId: number): Promise<Traveler | undefined> {
  const result = await db.select().from(travelers)
    .where(eq(travelers.id, travelerId))
    .limit(1);
  
  return result[0];
}

export async function createTraveler(newTraveler: NewTraveler): Promise<Traveler> {
  const result = await db.insert(travelers).values(newTraveler).returning();
  return result[0];
}

export async function updateTraveler(travelerId: number, travelerData: Partial<Traveler>): Promise<Traveler | undefined> {
  const result = await db.update(travelers)
    .set({
      ...travelerData,
      updated_at: new Date()
    })
    .where(eq(travelers.id, travelerId))
    .returning();
  
  return result[0];
}

export async function deleteTraveler(travelerId: number): Promise<boolean> {
  const result = await db.delete(travelers)
    .where(eq(travelers.id, travelerId))
    .returning({ id: travelers.id });
  
  return result.length > 0;
}

// Trip Sharing functions
export async function getTripSharingByTripId(tripId: number): Promise<TripSharing[]> {
  return await db.select().from(tripSharing)
    .where(eq(tripSharing.trip_id, tripId))
    .orderBy(asc(tripSharing.created_at));
}

export async function getTripSharingById(tripSharingId: number): Promise<TripSharing | undefined> {
  const result = await db.select().from(tripSharing)
    .where(eq(tripSharing.id, tripSharingId))
    .limit(1);
  
  return result[0];
}

export async function createTripSharing(newTripSharing: NewTripSharing): Promise<TripSharing> {
  const result = await db.insert(tripSharing).values(newTripSharing).returning();
  return result[0];
}

export async function updateTripSharing(tripSharingId: number, tripSharingData: Partial<TripSharing>): Promise<TripSharing | undefined> {
  const result = await db.update(tripSharing)
    .set({
      ...tripSharingData,
      updated_at: new Date()
    })
    .where(eq(tripSharing.id, tripSharingId))
    .returning();
  
  return result[0];
}

export async function deleteTripSharing(tripSharingId: number): Promise<boolean> {
  const result = await db.delete(tripSharing)
    .where(eq(tripSharing.id, tripSharingId))
    .returning({ id: tripSharing.id });
  
  return result.length > 0;
}

// Payment Schedule functions
export async function getPaymentSchedulesByTripId(tripId: number): Promise<PaymentSchedule[]> {
  const dbPaymentSchedules = await db.select().from(paymentSchedules)
    .where(eq(paymentSchedules.trip_id, tripId))
    .orderBy(asc(paymentSchedules.payment_date));
  
  return dbPaymentSchedules.map(mapDbPaymentSchedule);
}

export async function getPaymentScheduleById(paymentScheduleId: number): Promise<PaymentSchedule | undefined> {
  const result = await db.select().from(paymentSchedules)
    .where(eq(paymentSchedules.id, paymentScheduleId))
    .limit(1);
  
  return result[0] ? mapDbPaymentSchedule(result[0]) : undefined;
}

export async function createPaymentSchedule(newPaymentSchedule: NewPaymentSchedule): Promise<PaymentSchedule> {
  // Create a database-compatible object with string values for numeric fields
  const dbPaymentSchedule = {
    ...newPaymentSchedule,
    amount: newPaymentSchedule.amount !== null ? newPaymentSchedule.amount.toString() : null,
    is_paid: newPaymentSchedule.is_paid ?? false
  };
  
  const result = await db.insert(paymentSchedules).values(dbPaymentSchedule).returning();
  return mapDbPaymentSchedule(result[0]);
}

export async function updatePaymentSchedule(id: number, paymentScheduleData: Partial<PaymentSchedule>): Promise<PaymentSchedule> {
  // Create a database-compatible object with string values for numeric fields
  const dbPaymentSchedule: Record<string, any> = {};
  
  // Only copy fields that are present in paymentScheduleData
  Object.keys(paymentScheduleData).forEach(key => {
    if (key === 'amount') {
      // Convert numeric fields to strings
      const value = paymentScheduleData[key as keyof Partial<PaymentSchedule>];
      dbPaymentSchedule[key] = value !== null && value !== undefined ? value.toString() : null;
    } else if (key === 'is_paid') {
      // Handle boolean fields
      const value = paymentScheduleData[key as keyof Partial<PaymentSchedule>];
      dbPaymentSchedule[key] = value ?? false;
    } else {
      // Copy other fields as is
      dbPaymentSchedule[key] = paymentScheduleData[key as keyof Partial<PaymentSchedule>];
    }
  });
  
  const result = await db.update(paymentSchedules).set(dbPaymentSchedule).where(eq(paymentSchedules.id, id)).returning();
  return mapDbPaymentSchedule(result[0]);
}
}

export async function deletePaymentSchedule(paymentScheduleId: number): Promise<boolean> {
  const result = await db.delete(paymentSchedules)
    .where(eq(paymentSchedules.id, paymentScheduleId))
    .returning({ id: paymentSchedules.id });
  
  return result.length > 0;
}

// Advanced queries
export async function getTripWithDetails(tripId: number): Promise<Trip & { 
  destinations: Destination[],
  travelers: Traveler[],
  paymentSchedules: PaymentSchedule[]
} | undefined> {
  const trip = await getTripById(tripId);
  
  if (!trip) {
    return undefined;
  }
  
  const tripDestinations = await getDestinationsByTripId(tripId);
  const tripTravelers = await getTravelersByTripId(tripId);
  const tripPaymentSchedules = await getPaymentSchedulesByTripId(tripId);
  
  return {
    ...trip,
    destinations: tripDestinations,
    travelers: tripTravelers,
    paymentSchedules: tripPaymentSchedules
  };
}

export async function getDestinationWithDetails(destinationId: number): Promise<Destination & {
  lodging: Lodging | undefined,
  activities: Activity[],
  transportationFrom: Transportation[],
  transportationTo: Transportation[]
} | undefined> {
  const destination = await getDestinationById(destinationId);
  
  if (!destination) {
    return undefined;
  }
  
  const destinationLodging = await getLodgingByDestination(destinationId);
  const destinationActivities = await getActivitiesByDestination(destinationId);
  const transportationFrom = await getTransportationByDestination(destinationId, 'from');
  const transportationTo = await getTransportationByDestination(destinationId, 'to');
  
  return {
    ...destination,
    lodging: destinationLodging,
    activities: destinationActivities,
    transportationFrom,
    transportationTo
  };
}

export async function searchTrips(userId: number, query: string): Promise<Trip[]> {
  const dbTrips = await db.select().from(trips)
    .where(and(
      eq(trips.user_id, userId),
      sql`(${trips.title} ILIKE ${`%${query}%`} OR ${trips.description} ILIKE ${`%${query}%`})`
    ))
    .orderBy(desc(trips.created_at));
  
  return dbTrips.map(mapDbTrip);
}

export async function getUpcomingTrips(userId: number): Promise<Trip[]> {
  const today = new Date();
  
  const dbTrips = await db.select().from(trips)
    .where(and(
      eq(trips.user_id, userId),
      gte(trips.start_date, today),
      eq(trips.status, 'draft')
    ))
    .orderBy(asc(trips.start_date))
    .limit(5);
  
  return dbTrips.map(mapDbTrip);
}

export async function getOngoingTrips(userId: number): Promise<Trip[]> {
  const today = new Date();
  
  const dbTrips = await db.select().from(trips)
    .where(and(
      eq(trips.user_id, userId),
      lte(trips.start_date, today),
      gte(trips.end_date, today),
      eq(trips.status, 'in_progress')
    ))
    .orderBy(asc(trips.end_date));
  
  return dbTrips.map(mapDbTrip);
}

export async function getTripStatistics(userId: number): Promise<{
  total: number;
  completed: number;
  upcoming: number;
  ongoing: number;
  cancelled: number;
}> {
  const today = new Date();
  
  const total = await db.select({ count: sql<number>`count(*)` })
    .from(trips)
    .where(eq(trips.user_id, userId));
  
  const completed = await db.select({ count: sql<number>`count(*)` })
    .from(trips)
    .where(and(
      eq(trips.user_id, userId),
      eq(trips.status, 'completed')
    ));
  
  const upcoming = await db.select({ count: sql<number>`count(*)` })
    .from(trips)
    .where(and(
      eq(trips.user_id, userId),
      gte(trips.start_date, today),
      eq(trips.status, 'draft')
    ));
  
  const ongoing = await db.select({ count: sql<number>`count(*)` })
    .from(trips)
    .where(and(
      eq(trips.user_id, userId),
      lte(trips.start_date, today),
      gte(trips.end_date, today),
      eq(trips.status, 'in_progress')
    ));
  
  const cancelled = await db.select({ count: sql<number>`count(*)` })
    .from(trips)
    .where(and(
      eq(trips.user_id, userId),
      eq(trips.status, 'cancelled')
    ));
  
  return {
    total: total[0].count,
    completed: completed[0].count,
    upcoming: upcoming[0].count,
    ongoing: ongoing[0].count,
    cancelled: cancelled[0].count
  };
}
