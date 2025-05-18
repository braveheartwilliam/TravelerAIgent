import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth();
  
  if (session) {
    throw redirect(303, '/');
  }

  return new Response(null, { status: 200 });
};
