import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Parse the DATABASE_URL
const url = new URL(process.env.DATABASE_URL);

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    user: url.username,
    password: url.password || undefined,
    database: url.pathname.replace(/^\//, ''),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  verbose: true,
  strict: true,
  out: './drizzle',
  schemaFilter: ['public']
});
