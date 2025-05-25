import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in .env');
}

const client = postgres(databaseUrl);

async function introspect() {
  try {
    // Get all tables in the database
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    console.log('Tables in database:');
    console.table(tables);

    // Get detailed column information for the users table
    const columns = await client`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default,
        character_maximum_length,
        udt_name,
        column_comment
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position;
    `;
    
    console.log('\nColumns in users table:');
    console.table(columns);
    
  } catch (error) {
    console.error('Error introspecting database:', error);
  } finally {
    await client.end();
  }
}

introspect();
