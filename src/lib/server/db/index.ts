import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// Import the correct schema with userName (camelCase)
import * as schema from '../schema'; // This is the correct schema with userName (camelCase)

// Get DATABASE_URL from environment variables
const DATABASE_URL = process.env['DATABASE_URL'];

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Create a single connection to the database
const client = postgres(DATABASE_URL);

// Initialize Drizzle with the database schema
export const db = drizzle(client, { schema });
