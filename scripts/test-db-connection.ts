import { db } from '../src/lib/server/db';
import { users } from '../src/lib/server/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

async function testDbConnection() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!', result);

    // Test users table
    console.log('\nTesting users table...');
    const testEmail = 'test@example.com';
    const user = await db.query.users.findFirst({
      where: eq(users.email, testEmail)
    });

    if (user) {
      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        userName: user.userName
      });
    } else {
      console.log(`ℹ️ No user found with email: ${testEmail}`);
    }

    // List first 5 users
    console.log('\nListing first 5 users:');
    const allUsers = await db.query.users.findMany({
      limit: 5,
      columns: {
        id: true,
        email: true,
        userName: true,
        created_at: true
      }
    });
    console.table(allUsers);

  } catch (error) {
    console.error('❌ Database test failed:');
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

testDbConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
