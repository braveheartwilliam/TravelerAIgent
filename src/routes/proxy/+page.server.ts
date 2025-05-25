import { redirect } from '@sveltejs/kit';

export function load() {
  // Redirect to the home page by default
  throw redirect(303, '/');
}
