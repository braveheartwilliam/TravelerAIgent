import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals, params }) => {
  const { provider } = params;
  const session = await locals.getSession?.();
  
  // If we have a session, redirect to the app
  if (session?.user) {
    const callbackUrl = url.searchParams.get('callbackUrl') || '/';
    throw redirect(303, callbackUrl);
  }

  // If we get here, the callback didn't complete successfully
  console.error(`Failed to authenticate with ${provider}`);
  throw redirect(303, '/auth/signin?error=OAuthCallbackError');
};
