import { db } from '../src/lib/server/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { users } from '../src/lib/server/schema';

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Create migrations table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS __migrations__ (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if last_failed_login column exists
    try {
      const columnCheck = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_failed_login'
      `);
      
      if (!Array.isArray(columnCheck) || columnCheck.length === 0) {
        console.log('Adding last_failed_login column to users table...');
        await db.execute(sql`
          ALTER TABLE users 
          ADD COLUMN last_failed_login TIMESTAMP WITH TIME ZONE
        `);
        console.log('✅ Added last_failed_login column to users table');
      } else {
        console.log('✅ last_failed_login column already exists in users table');
      }
      
      // Check if index exists
      const indexCheck = await db.execute(sql`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'users_last_failed_login_idx'
      `);
      
      if (!Array.isArray(indexCheck) || indexCheck.length === 0) {
        console.log('Creating index on last_failed_login column...');
        await db.execute(sql`
          CREATE INDEX users_last_failed_login_idx ON users(last_failed_login)
        `);
        console.log('✅ Created index on last_failed_login column');
      } else {
        console.log('✅ Index on last_failed_login column already exists');
      }
    } catch (error) {
      console.error('Error checking/updating database schema:', error);
      throw error;
    }

    // Get all migration files (skip the SQL migration since we're handling it directly)
    const migrationsDir = path.join(process.cwd(), 'src/lib/db/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && !file.includes('_add_last_failed_login'))
      .sort();
      
    console.log(`Found ${migrationFiles.length} migration files to process`);

    // Run each migration that hasn't been executed yet
    for (const file of migrationFiles) {
      const migrationName = path.basename(file, '.sql');
      
      // Check if migration has already been run
      const result = await db.execute(
        sql`SELECT id FROM __migrations__ WHERE name = ${migrationName}`
      );
      
      // Check if any rows were returned
      const hasMigration = Array.isArray(result) && result.length > 0;
      
      if (!hasMigration) {
        console.log(`Running migration: ${migrationName}`);
        
        // Read and execute the migration SQL
        const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await db.execute(sql.raw(migrationSql));
        
        // Record the migration
        await db.execute(
          sql`INSERT INTO __migrations__ (name) VALUES (${migrationName})`
        );
        
        console.log(`✅ Successfully applied migration: ${migrationName}`);
      } else {
        console.log(`✓ Migration already applied: ${migrationName}`);
      }
    }
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
