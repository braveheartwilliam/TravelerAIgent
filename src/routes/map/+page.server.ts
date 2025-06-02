import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  const session = locals.session;
  
  if (!session?.user) {
    // Redirect to login if not authenticated
    throw redirect(302, '/login');
  }
  
  return {
    user: session.user
  };
};
