import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const session = await locals.getSession?.();
  
  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    throw redirect(303, '/auth/signin?callbackUrl=/app/profile');
  }

  // You can fetch additional user data here
  // For example, from your database
  
  return {
    session: {
      user: session.user
    },
    // Add any additional data you want to pass to the page
  };
}) satisfies PageServerLoad;
