import type { User, Trip } from '$lib/server/schema';

export interface PageData {
  user: User | null;
  trips: Trip[] | null;
}
