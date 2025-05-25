import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Get the session using the safe method
  const session = await locals.getSession?.();

  if (!session?.user) {
    throw redirect(303, '/auth/signin');
  }

  return {
    user: session.user
  };
};
