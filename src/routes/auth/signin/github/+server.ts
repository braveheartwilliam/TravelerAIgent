import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const { url } = event;
  const callbackUrl = url.searchParams.get('callbackUrl') || '/';
  throw redirect(307, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&provider=github`);
};
