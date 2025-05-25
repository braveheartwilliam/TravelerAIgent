import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in .env');
}

// Create the database connection with basic logging
const client = postgres(databaseUrl, {
  debug: (connection, query, params) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Database Query:', { 
        query, 
        params: params?.map(p => p?.toString().substring(0, 100) + (p?.toString().length > 100 ? '...' : ''))
      });
    }
  }
});

// Create the Drizzle instance with the schema
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development' ? {
    logQuery: (query, params) => {
      console.log('Drizzle Query:', { query, params });
    }
  } : false
});

export * from './schema';
