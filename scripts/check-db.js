import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function checkDatabase() {
  console.log('Checking database connection...');
  
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in environment variables');
    return;
  }

  const client = postgres(DATABASE_URL);
  const db = drizzle(client, { schema });

  try {
    console.log('Testing database connection...');
    await client`SELECT 1`;
    console.log('✅ Database connection successful!');
    
    // Check if users table exists and has data
    console.log('\nChecking users table...');
    try {
      const users = await db.query.users.findMany({ limit: 1 });
      console.log(`✅ Users table exists with ${users.length} records`);
    } catch (err) {
      console.error('❌ Error querying users table:', err.message);
    }
    
    // List all tables in the database
    console.log('\nListing all tables in the database:');
    try {
      const tables = await client`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      if (tables.length === 0) {
        console.log('No tables found in the database.');
      } else {
        console.log('Found tables:');
        tables.forEach((table, index) => {
          console.log(`  ${index + 1}. ${table.table_name}`);
        });
      }
    } catch (err) {
      console.error('❌ Error listing tables:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase().catch(console.error);
