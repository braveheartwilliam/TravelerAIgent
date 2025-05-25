import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
  // Get the session using the safe method
  const session = await event.locals.getSession?.();
  
  if (!session?.user) {
    throw redirect(303, `/auth/signin?callbackUrl=${event.url.pathname}`);
  }

  return session;
}

export async function redirectIfAuthenticated(event: RequestEvent) {
  // Get the session using the safe method
  const session = await event.locals.getSession?.();
  
  if (session?.user) {
    throw redirect(303, '/');
  }

  return session;
}
