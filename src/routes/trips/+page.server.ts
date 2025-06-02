import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTrips } from '$lib/services/tripService';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('[Trips] Load function called');
  console.log('[Trips] User from locals:', locals.user);
  
  // Check if user exists in locals (set by handleAuth)
  if (!locals.user) {
    console.log('[Trips] No authenticated user found, redirecting to signin');
    throw redirect(303, '/auth/signin');
  }

  try {
    // Fetch trips for the current user
    console.log('[Trips] Fetching trips for user:', locals.user.id);
    const trips = await getTrips(locals.user.id);
    
    return {
      user: locals.user,
      trips
    };
  } catch (error) {
    console.error('[Trips] Error fetching trips:', error);
    return {
      user: locals.user,
      trips: [],
      error: 'Failed to load trips. Please try again later.'
    };
  }
};
