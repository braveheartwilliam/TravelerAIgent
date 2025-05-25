import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

async function checkDatabase() {
  console.log('Checking database connection...');
  
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in environment variables');
    return;
  }

  console.log('Using DATABASE_URL:', DATABASE_URL.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@'));
  
  const client = postgres(DATABASE_URL);

  try {
    // Test connection
    console.log('\nTesting database connection...');
    const result = await client`SELECT 1 as test`;
    console.log('✅ Database connection successful!', result[0]);
    
    // List all tables
    console.log('\nListing all tables in the database:');
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
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase().catch(console.error);
