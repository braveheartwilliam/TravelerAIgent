import { db } from '$lib/server/db';
import { eq, and, asc, desc, inArray, isNull, isNotNull, gte, lte, like, sql } from 'drizzle-orm';
import { users, userPreferences } from '$lib/server/schema.updated';
import type { User, UserPreference, NewUser, NewUserPreference } from '$lib/types/users';

/**
 * User Repository
 * Provides functions for interacting with user-related entities in the database
 */

// User functions
export async function getUserById(userId: number): Promise<User | undefined> {
  const result = await db.select().from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  return result[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db.select().from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return result[0];
}

export async function getUserByUserName(userName: string): Promise<User | undefined> {
  const result = await db.select().from(users)
    .where(eq(users.userName, userName))
    .limit(1);
  
  return result[0];
}

export async function createUser(newUser: NewUser): Promise<User> {
  const result = await db.insert(users).values(newUser).returning();
  return result[0];
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<User | undefined> {
  const result = await db.update(users)
    .set({
      ...userData,
      updated_at: new Date()
    })
    .where(eq(users.id, userId))
    .returning();
  
  return result[0];
}

export async function deleteUser(userId: number): Promise<boolean> {
  const result = await db.delete(users)
    .where(eq(users.id, userId))
    .returning({ id: users.id });
  
  return result.length > 0;
}

// User Preferences functions
export async function getUserPreferences(userId: number): Promise<UserPreference[]> {
  return await db.select().from(userPreferences)
    .where(eq(userPreferences.user_id, userId))
    .orderBy(asc(userPreferences.key));
}

export async function getUserPreferenceByKey(userId: number, key: string): Promise<UserPreference | undefined> {
  const result = await db.select().from(userPreferences)
    .where(and(
      eq(userPreferences.user_id, userId),
      eq(userPreferences.key, key)
    ))
    .limit(1);
  
  return result[0];
}

export async function setUserPreference(userId: number, key: string, value: string): Promise<UserPreference> {
  // Check if preference already exists
  const existingPref = await getUserPreferenceByKey(userId, key);
  
  if (existingPref) {
    // Update existing preference
    const result = await db.update(userPreferences)
      .set({
        value,
        updated_at: new Date()
      })
      .where(and(
        eq(userPreferences.user_id, userId),
        eq(userPreferences.key, key)
      ))
      .returning();
    
    return result[0];
  } else {
    // Create new preference
    const newPref: NewUserPreference = {
      user_id: userId,
      key,
      value
    };
    
    const result = await db.insert(userPreferences).values(newPref).returning();
    return result[0];
  }
}

export async function deleteUserPreference(userId: number, key: string): Promise<boolean> {
  const result = await db.delete(userPreferences)
    .where(and(
      eq(userPreferences.user_id, userId),
      eq(userPreferences.key, key)
    ))
    .returning({ id: userPreferences.id });
  
  return result.length > 0;
}

export async function getUserWithPreferences(userId: number): Promise<User & { preferences: UserPreference[] } | undefined> {
  const user = await getUserById(userId);
  
  if (!user) {
    return undefined;
  }
  
  const preferences = await getUserPreferences(userId);
  
  return {
    ...user,
    preferences
  };
}

// User statistics and analytics
export async function getUserTripStatistics(userId: number): Promise<{
  totalTrips: number;
  totalDestinations: number;
  totalCountriesVisited: number;
}> {
  // This query would typically join with the trips and destinations tables
  // For now, we'll implement a simplified version
  
  const totalTripsResult = await db.select({ count: sql<number>`count(*)` })
    .from(sql`trips`)
    .where(eq(sql`trips.user_id`, userId));
  
  const totalDestinationsResult = await db.select({ count: sql<number>`count(*)` })
    .from(sql`destinations`)
    .where(eq(sql`destinations.trip_id`, sql`(SELECT id FROM trips WHERE user_id = ${userId})`));
  
  const totalCountriesResult = await db.select({ count: sql<number>`count(DISTINCT country)` })
    .from(sql`destinations`)
    .where(eq(sql`destinations.trip_id`, sql`(SELECT id FROM trips WHERE user_id = ${userId})`));
  
  return {
    totalTrips: totalTripsResult[0]?.count || 0,
    totalDestinations: totalDestinationsResult[0]?.count || 0,
    totalCountriesVisited: totalCountriesResult[0]?.count || 0
  };
}
