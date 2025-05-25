import type { LayoutServerLoad } from '../+layout.server';

export const load = (async ({ parent }) => {
  const { session } = await parent();
  return { session };
}) satisfies LayoutServerLoad;
