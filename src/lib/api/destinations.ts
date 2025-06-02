import type { Destination } from '$lib/types/trip';
import type { AddDestinationFn, UpdateDestinationFn, RemoveDestinationFn, GetDestinationsFn } from '$lib/types/api';

/**
 * Add a new destination to a trip
 */
export const addDestination: AddDestinationFn = async (tripId, destination) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destination),
    });

    if (!response.ok) {
      throw new Error(`Failed to add destination: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding destination:', error);
    throw error;
  }
};

/**
 * Update an existing destination
 */
export const updateDestination: UpdateDestinationFn = async (tripId, destination) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/destinations/${destination.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destination),
    });

    if (!response.ok) {
      throw new Error(`Failed to update destination: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating destination:', error);
    throw error;
  }
};

/**
 * Remove a destination from a trip
 */
export const removeDestination: RemoveDestinationFn = async (tripId, destinationId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/destinations/${destinationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove destination: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing destination:', error);
    throw error;
  }
};

/**
 * Get all destinations for a trip
 */
export const getDestinations: GetDestinationsFn = async (tripId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/destinations`);

    if (!response.ok) {
      throw new Error(`Failed to get destinations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting destinations:', error);
    throw error;
  }
};
