import type { Activity } from '$lib/types/trip';
import type { AddActivityFn, UpdateActivityFn, RemoveActivityFn, GetActivitiesFn } from '$lib/types/api';

/**
 * Add a new activity to a trip
 */
export const addActivity: AddActivityFn = async (tripId, activity) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error(`Failed to add activity: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

/**
 * Update an existing activity
 */
export const updateActivity: UpdateActivityFn = async (tripId, activity) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/activities/${activity.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error(`Failed to update activity: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

/**
 * Remove an activity from a trip
 */
export const removeActivity: RemoveActivityFn = async (tripId, activityId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/activities/${activityId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove activity: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing activity:', error);
    throw error;
  }
};

/**
 * Get all activities for a trip
 */
export const getActivities: GetActivitiesFn = async (tripId) => {
  try {
    const response = await fetch(`/api/trips/${tripId}/activities`);

    if (!response.ok) {
      throw new Error(`Failed to get activities: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  }
};
