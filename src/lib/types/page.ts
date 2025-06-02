import type { Trip } from './trip';

// SvelteKit page data types
export interface PageData {
  trip: Trip;
}

// Route params
export interface TripParams {
  id: string;
}
