import { db } from '../src/lib/server/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('Database connection successful!', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    process.exit(0);
  }
}

testConnection();
