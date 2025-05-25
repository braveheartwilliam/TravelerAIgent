// Wrapper for better-auth SvelteKit integration
import type { BetterAuthOptions } from 'better-auth';

export type AuthHandlers = {
  handler: (request: Request) => Promise<Response>;
  options: BetterAuthOptions;
};

export async function createSvelteKitHandler(auth: AuthHandlers) {
  // Dynamic import to handle module resolution
  const { toSvelteKitHandler } = await import('better-auth/integrations/svelte-kit');
  
  // Create a SvelteKit compatible handler
  return toSvelteKitHandler(auth);
}

export async function handleAuthRequest(
  event: {
    request: Request;
    url: URL;
  },
  resolve: (event: any) => any,
  auth: AuthHandlers
) {
  const handler = await createSvelteKitHandler(auth);
  return handler(event, resolve);
}
