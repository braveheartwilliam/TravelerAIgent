import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

export const auth = SvelteKitAuth({
  providers: [
    GitHub({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    })
  ],
  secret: env.AUTH_SECRET,
  trustHost: true
}) satisfies Handle;
