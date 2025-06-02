import type { Trip } from '$lib/types/trip';
import type { UpdateTripFn, GetTripFn, GetTripsFn, CreateTripFn, DeleteTripFn } from '$lib/types/api';

/**
 * Create a new trip
 */
export const createTrip: CreateTripFn = async (trip) => {
  try {
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trip),
    });

    if (!response.ok) {
      throw new Error(`Failed to create trip: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

/**
 * Update an existing trip
 */
export const updateTrip: UpdateTripFn = async (tripId, trip) => {
  try {
    const response = await fetch(`/api/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trip),
    });

    if (!response.ok) {
      throw new Error(`Failed to update trip: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

/**
 * Get a specific trip by ID
 */
export const getTrip: GetTripFn = async (tripId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}`);

    if (!response.ok) {
      throw new Error(`Failed to get trip: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting trip:', error);
    throw error;
  }
};

/**
 * Get all trips for the current user
 */
export const getTrips: GetTripsFn = async () => {
  try {
    const response = await fetch('/api/trips');

    if (!response.ok) {
      throw new Error(`Failed to get trips: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting trips:', error);
    throw error;
  }
};

/**
 * Delete a trip
 */
export const deleteTrip: DeleteTripFn = async (tripId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete trip: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};
