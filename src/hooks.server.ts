import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

const authHandle = SvelteKitAuth({
  providers: [GitHub({
    clientId: env.GITHUB_ID,
    clientSecret: env.GITHUB_SECRET,
    authorization: {
      params: {
        redirect_uri: 'http://127.0.0.1:65477/auth/callback/github'
      }
    }
  })],
  secret: env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/auth/signin'
  }
});

export const handle: Handle = async ({ event, resolve }) => {
  // Handle CORS preflight requests
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    });
  }

  const response = await authHandle.handle({ event, resolve });

  // Add CORS headers to response
  response.headers.append('Access-Control-Allow-Origin', '*');
  response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.append('Access-Control-Allow-Headers', '*');
  response.headers.append('Access-Control-Allow-Credentials', 'true');

  return response;
};
