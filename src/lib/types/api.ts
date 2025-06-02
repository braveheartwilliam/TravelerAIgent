// API function types for destinations, transportation, activities, lodging, and trips

import type { Destination, Transportation, Activity, Lodging, Trip } from './trip';

// Destinations API
export type AddDestinationFn = (tripId: string, destination: Partial<Destination>) => Promise<Destination>;
export type UpdateDestinationFn = (tripId: string, destination: Partial<Destination>) => Promise<Destination>;
export type RemoveDestinationFn = (tripId: string, destinationId: string) => Promise<void>;
export type GetDestinationsFn = (tripId: string) => Promise<Destination[]>;

// Transportation API
export type AddTransportationFn = (tripId: string, transportation: Partial<Transportation>) => Promise<Transportation>;
export type UpdateTransportationFn = (tripId: string, transportation: Partial<Transportation>) => Promise<Transportation>;
export type RemoveTransportationFn = (tripId: string, transportationId: string) => Promise<void>;
export type GetTransportationFn = (tripId: string) => Promise<Transportation[]>;

// Activities API
export type AddActivityFn = (tripId: string, activity: Partial<Activity>) => Promise<Activity>;
export type UpdateActivityFn = (tripId: string, activity: Partial<Activity>) => Promise<Activity>;
export type RemoveActivityFn = (tripId: string, activityId: string) => Promise<void>;
export type GetActivitiesFn = (tripId: string) => Promise<Activity[]>;

// Lodging API
export type AddLodgingFn = (tripId: string, lodging: Partial<Lodging>) => Promise<Lodging>;
export type UpdateLodgingFn = (tripId: string, lodging: Partial<Lodging>) => Promise<Lodging>;
export type RemoveLodgingFn = (tripId: string, lodgingId: string) => Promise<void>;
export type GetLodgingFn = (tripId: string) => Promise<Lodging[]>;

// Trips API
export type UpdateTripFn = (tripId: string, trip: Partial<Trip>) => Promise<Trip>;
export type GetTripFn = (tripId: string) => Promise<Trip>;
export type GetTripsFn = () => Promise<Trip[]>;
export type CreateTripFn = (trip: Partial<Trip>) => Promise<Trip>;
export type DeleteTripFn = (tripId: string) => Promise<void>;
