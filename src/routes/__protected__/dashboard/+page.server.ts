import { redirect, type ServerLoadEvent, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { trips, type Trip, type User } from '$lib/server/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import type { PgSelect } from 'drizzle-orm/pg-core';

// Type for the user data we'll return to the client
type UserResponse = {
  id: number;
  email: string;
  name: string;  // Display name (can be fullName or userName)
  userName: string;  // Unique username
  fullName: string | null;
  role: 'user' | 'admin' | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

// Type for the page data
type PageData = {
  user: UserResponse;
  trips: Trip[];
};

// Helper to safely get a date as ISO string
const toISODateString = (date: Date | string | null | undefined): string => {
  if (!date) return new Date().toISOString();
  return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
};

// Helper function to safely parse user ID
function getUserId(userId: string | undefined): number {
  if (!userId) throw new Error('User ID is required');
  const id = parseInt(userId, 10);
  if (isNaN(id)) throw new Error(`Invalid user ID: ${userId}`);
  return id;
}

// Helper function to format trips and ensure they match the Trip type
function formatTrips(trips: Trip[]): Trip[] {
  return trips.map(trip => {
    // Convert string dates to Date objects if needed
    const formatDate = (date: Date | string | null | undefined): Date => {
      if (!date) return new Date();
      return date instanceof Date ? date : new Date(date);
    };

    // Create a new trip object with properly typed dates
    const formattedTrip: Trip = {
      id: trip.id,
      user_id: trip.user_id,
      destination: trip.destination,
      description: trip.description ?? null,
      start_date: formatDate(trip.start_date),
      end_date: formatDate(trip.end_date),
      budget: trip.budget ?? null,
      status: trip.status || 'planned',
      created_at: formatDate(trip.created_at),
      updated_at: formatDate(trip.updated_at)
    };

    return formattedTrip;
  });
}

// Extend the ServerLoadEvent type to include our custom locals
type DashboardLoadEvent = ServerLoadEvent & {
  locals: App.Locals & {
    user?: {
      id: string | number;
      email?: string | null;
      name?: string;
      userName?: string;
      fullName?: string | null;
      role?: 'user' | 'admin' | string;
      is_active?: boolean;
      createdAt?: string | Date | null;
      updatedAt?: string | Date | null;
    } | null;
  };
};

// This runs on the server when the page loads
export async function load(event: DashboardLoadEvent) {
  console.log('=== DASHBOARD LOAD START ===');
  console.log('Dashboard load function called');
  
  // Log the full event object (excluding sensitive data)
  console.log('Event object keys:', Object.keys(event));
  console.log('Request URL:', event.url.toString());
  console.log('Request headers:', Object.fromEntries(event.request.headers.entries()));
  
  // Get the user from locals (already set by the auth hook)
  const userFromLocals = event.locals.user;
  
  console.log('User from locals:', JSON.stringify(userFromLocals, null, 2));
  
  // Check if user is authenticated
  if (!userFromLocals?.id) {
    console.error('No authenticated user found in locals, redirecting to signin');
    throw redirect(303, '/auth/signin');
  }
  
  console.log('User ID from locals:', userFromLocals.id);
  
  // Get user ID and ensure it's a number
  let userId: number;
  try {
    userId = getUserId(userFromLocals.id.toString());
    console.log('Parsed user ID:', userId);
  } catch (idError) {
    console.error('Error parsing user ID:', idError);
    throw redirect(303, '/auth/signin');
  }
  
  // Helper function to safely get a date string
  const getDateString = (date: string | Date | null | undefined): string => {
    if (!date) return new Date().toISOString();
    return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
  };

  // Create a properly typed user object with all required fields
  const user: UserResponse = {
    id: Number(userFromLocals.id),
    email: userFromLocals.email || '',
    name: userFromLocals.name || userFromLocals.userName || '',
    userName: userFromLocals.userName || '',
    fullName: userFromLocals.fullName || null,
    role: (userFromLocals.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
    is_active: userFromLocals.is_active ?? true,
    createdAt: getDateString(userFromLocals.createdAt),
    updatedAt: getDateString(userFromLocals.updatedAt)
  };
  
  console.log('Processed user object:', JSON.stringify(user, null, 2));
  
  try {
    console.log('Processed user data:', JSON.stringify(user, null, 2));
    console.log('User data from session:', {
      id: user.id,
      email: user.email,
      userName: user.userName,
      role: user.role
    });
    console.log('Loading dashboard for user ID:', userId);

    // Initialize empty trips array
    let userTrips: Trip[] = [];
    
    try {
      console.log('Checking database connection...');
      // Check database connection
      const dbCheck = await db.execute(sql`SELECT 1`);
      console.log('✅ Database connection successful', dbCheck);
      
      // Check if trips table exists
      console.log('Checking if trips table exists...');
      const tableExists = await db.execute<{ exists: boolean }>(
        sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trips') as "exists"`
      );
      
      const tripsTableExists = tableExists[0]?.exists ?? false;
      console.log('Trips table exists:', tripsTableExists);
      console.log('Trips table exists:', tripsTableExists);
      
      if (!tripsTableExists) {
        console.warn('Trips table does not exist');
        throw new Error('Trips table not found');
      }
      
      // Check if user has any trips
      const tripCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(trips)
        .where(eq(trips.user_id, userId));
      
      const hasTrips = (tripCount[0]?.count ?? 0) > 0;
      console.log(`User ${userId} has ${tripCount[0]?.count || 0} trips`);
      
      if (hasTrips) {
        // Fetch user's trips
        console.log('Fetching trips for user:', userId);
        const tripResults = await db
          .select()
          .from(trips)
          .where(eq(trips.user_id, userId))
          .orderBy(desc(trips.start_date));
        
        console.log(`Found ${tripResults.length} trips`);
        userTrips = tripResults;
      }
      
    } catch (dbError) {
      console.error('Database error:', {
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined,
        userId
      });
      // Continue with empty trips array on database error
      userTrips = [];
    }

    // Format the user data to match the frontend's User interface
    console.log('Formatting user response...');
    const fullName = 'fullName' in user ? String((user as any).fullName || '') : null;
    const userName = 'userName' in user ? String((user as any).userName || '') : '';
    
    const userResponse: UserResponse = {
      id: Number(user.id),
      email: user.email || '',
      name: fullName || userName, // Use fullName if available, otherwise fall back to userName
      userName: userName,
      fullName: fullName,
      role: ('role' in user ? (user as any).role : 'user') as 'user' | 'admin' | null,
      is_active: 'is_active' in user ? Boolean((user as any).is_active) : true,
      // Ensure dates are properly formatted as ISO strings
      createdAt: toISODateString(
        'createdAt' in user ? (user as any).createdAt : 
        'created_at' in user ? (user as any).created_at : 
        null
      ),
      updatedAt: toISODateString(
        'updatedAt' in user ? (user as any).updatedAt : 
        'updated_at' in user ? (user as any).updated_at : 
        null
      )
    };
    console.log('Formatted user response:', JSON.stringify(userResponse, null, 2));

    const response: PageData = {
      user: userResponse,
      trips: formatTrips(userTrips)
    };
    
    console.log('Dashboard load completed successfully');
    return response;
    
  } catch (err) {
    const error = err as Error;
    console.error('❌ Error in dashboard server load:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Only redirect to sign-in for authentication errors
    if (error.message.includes('Not authenticated') || error.message.includes('No user found')) {
      throw redirect(303, '/auth/signin');
    }
    
    // For other errors, return empty data but don't redirect
    return {
      user: null,
      trips: []
    };
  }
}
