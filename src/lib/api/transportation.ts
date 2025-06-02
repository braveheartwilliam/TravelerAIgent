import type { Transportation } from '$lib/types/trip';
import type { AddTransportationFn, UpdateTransportationFn, RemoveTransportationFn, GetTransportationFn } from '$lib/types/api';

/**
 * Add a new transportation to a trip
 */
export const addTransportation: AddTransportationFn = async (tripId, transportation) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/transportation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transportation),
    });

    if (!response.ok) {
      throw new Error(`Failed to add transportation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding transportation:', error);
    throw error;
  }
};

/**
 * Update an existing transportation
 */
export const updateTransportation: UpdateTransportationFn = async (tripId, transportation) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/transportation/${transportation.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transportation),
    });

    if (!response.ok) {
      throw new Error(`Failed to update transportation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating transportation:', error);
    throw error;
  }
};

/**
 * Remove a transportation from a trip
 */
export const removeTransportation: RemoveTransportationFn = async (tripId, transportationId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/transportation/${transportationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove transportation: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing transportation:', error);
    throw error;
  }
};

/**
 * Get all transportation for a trip
 */
export const getTransportation: GetTransportationFn = async (tripId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/transportation`);

    if (!response.ok) {
      throw new Error(`Failed to get transportation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting transportation:', error);
    throw error;
  }
};
