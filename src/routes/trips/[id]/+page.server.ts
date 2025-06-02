import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTripById } from '$lib/services/tripService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  // Get the session using the safe method
  const session = await locals.getSession?.();

  if (!session?.user) {
    throw redirect(303, '/auth/signin');
  }

  try {
    // Fetch trip details for the specific trip ID
    const trip = await getTripById(params.id);
    
    if (!trip) {
      throw error(404, {
        message: 'Trip not found'
      });
    }
    
    return {
      user: session.user,
      trip
    };
  } catch (err) {
    console.error('Error fetching trip details:', err);
    throw error(500, {
      message: 'Failed to load trip details. Please try again later.'
    });
  }
};
