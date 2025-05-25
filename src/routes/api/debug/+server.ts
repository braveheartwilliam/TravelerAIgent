import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      AUTH_SECRET: process.env.AUTH_SECRET ? 'Set' : 'Not set',
      GITHUB_ID: process.env.GITHUB_ID ? 'Set' : 'Not set',
      GITHUB_SECRET: process.env.GITHUB_SECRET ? 'Set' : 'Not set',
    },
    time: new Date().toISOString(),
  });
};
