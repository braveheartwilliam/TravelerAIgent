import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading environment from: ${envPath}`);

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

dotenv.config({ path: envPath });

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;
console.log('Database URL:', databaseUrl ? `${databaseUrl.split('@')[0]}@${databaseUrl.split('@')[1]}` : 'Not set');

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

async function checkDatabase() {
  let client;
  
  try {
    // Create a raw connection
    console.log('\n🔍 Testing database connection...');
    client = postgres(databaseUrl!, { max: 1 });
    
    // Test connection
    const result = await client`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result[0]);
    
    // Create Drizzle instance
    const db = drizzle(client);
    
    // Check if users table exists
    console.log('\n🔍 Checking users table...');
    const usersTable = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      ) as "exists"
    `;
    console.log('Users table exists:', usersTable[0].exists);
    
    if (usersTable[0].exists) {
      const userCount = await client`SELECT COUNT(*) as count FROM users`;
      console.log('Number of users:', userCount[0].count);
    }

    // Check if trips table exists
    console.log('\n🔍 Checking trips table...');
    const tripsTable = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'trips'
      ) as "exists"
    `;
    console.log('Trips table exists:', tripsTable[0].exists);
    
    if (tripsTable[0].exists) {
      const tripCount = await client`SELECT COUNT(*) as count FROM trips`;
      console.log('Number of trips:', tripCount[0].count);
      
      if (tripCount[0].count > 0) {
        const trips = await client`SELECT * FROM trips LIMIT 3`;
        console.log('\nSample trips:');
        console.table(trips);
      }
    }
    
    // Check schema
    console.log('\n🔍 Checking database schema...');
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n📋 Database tables:');
    console.table(tables.map(t => ({ table: t.table_name })));
    
  } catch (error: any) {
    console.error('❌ Database check failed:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack?.split('\n').slice(0, 3).join('\n'));
    
    // Check for common connection issues
    if (error.code === '28P01') {
      console.error('\n🔑 Authentication failed. Check your database username and password.');
    } else if (error.code === '3D000') {
      console.error('\n💾 Database does not exist. Did you create it?');
      console.log('Try running: createdb travelerAIgent');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔌 Connection refused. Is PostgreSQL running?');
      console.log('Try starting PostgreSQL with: brew services start postgresql@15');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
    process.exit(0);
  }
}

checkDatabase();
