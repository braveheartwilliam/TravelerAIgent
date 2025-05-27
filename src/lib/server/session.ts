import { db } from './db';
import { sessions } from './schema';
import { eq, and, gte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { User } from './schema';

// Re-export client-side session types
export * from '$lib/auth/session';

// Define session data separately from User type to avoid type conflicts
interface SessionData {
  id: number; // User ID
  email: string;
  userName: string;
  role: 'user' | 'admin';
  [key: string]: any;
}

interface DBSession {
  id: string;
  user_id: number;
  expires_at: Date;
  created_at: Date;
  data: string | null; // Store session data as JSON string
}

interface Session extends Omit<SessionData, 'id'> {
  id: string; // Session ID (different from user ID)
  user_id: number; // User ID
  expires_at: Date;
}

export async function createSession(data: SessionData, expiresInHours = 24): Promise<Session> {
  const sessionId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const { id: userId, ...sessionData } = data;
  const sessionPayload = {
    email: data.email,
    userName: data.userName,
    role: data.role
  };

  await db.insert(sessions).values({
    id: sessionId,
    user_id: userId,
    data: JSON.stringify(sessionPayload),
    expires_at: expiresAt,
    created_at: new Date()
  });

  return {
    id: sessionId,
    user_id: userId,
    ...sessionPayload,
    expires_at: expiresAt
  };
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        gte(sessions.expires_at, new Date())
      )
    )
    .limit(1);

  if (!session?.data) return null;

  try {
    const sessionData = JSON.parse(session.data);
    return {
      id: session.id,
      user_id: session.user_id,
      ...sessionData,
      expires_at: session.expires_at
    };
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db
    .delete(sessions)
    .where(eq(sessions.id, sessionId));
}

export async function updateSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) return;

  const updatedData = {
    ...session,
    ...data
  };

  await db
    .update(sessions)
    .set({
      data: JSON.stringify(updatedData),
      expires_at: updatedData.expires_at
    })
    .where(eq(sessions.id, sessionId));
}
