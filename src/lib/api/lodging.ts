import type { Lodging } from '$lib/types/trip';
import type { AddLodgingFn, UpdateLodgingFn, RemoveLodgingFn, GetLodgingFn } from '$lib/types/api';

/**
 * Add a new lodging to a trip
 */
export const addLodging: AddLodgingFn = async (tripId, lodging) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/lodging`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lodging),
    });

    if (!response.ok) {
      throw new Error(`Failed to add lodging: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding lodging:', error);
    throw error;
  }
};

/**
 * Update an existing lodging
 */
export const updateLodging: UpdateLodgingFn = async (tripId, lodging) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/lodging/${lodging.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lodging),
    });

    if (!response.ok) {
      throw new Error(`Failed to update lodging: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating lodging:', error);
    throw error;
  }
};

/**
 * Remove a lodging from a trip
 */
export const removeLodging: RemoveLodgingFn = async (tripId, lodgingId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/lodging/${lodgingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove lodging: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing lodging:', error);
    throw error;
  }
};

/**
 * Get all lodging for a trip
 */
export const getLodging: GetLodgingFn = async (tripId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/lodging`);

    if (!response.ok) {
      throw new Error(`Failed to get lodging: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting lodging:', error);
    throw error;
  }
};
