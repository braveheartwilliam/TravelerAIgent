import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // If user is not authenticated, redirect to sign-in
  if (!locals.user) {
    throw redirect(307, '/auth/signin');
  }

  return {
    user: locals.user
  };
};
