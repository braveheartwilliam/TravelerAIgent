import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const session = await locals.auth();
  
  // Redirect to home page if already signed in
  if (session) {
    throw redirect(303, '/');
  }

  return {
    url: url.origin
  };
};
