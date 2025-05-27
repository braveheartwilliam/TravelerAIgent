import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq, or } from 'drizzle-orm';
import { hashPassword, validateUserInput } from '$lib/server/auth-utils';
import { createSession } from '$lib/server/session-utils';
import type { RequestHandler } from './$types';

interface SignUpRequest {
  email: string;
  userName: string;
  fullName?: string;
  password: string;
  confirmPassword: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    // Parse and validate request
    const data: SignUpRequest = await request.json();
    
    // Validate input
    const validation = validateUserInput({
      email: data.email,
      userName: data.userName,
      password: data.password,
      confirmPassword: data.confirmPassword
    });

    if (!validation.valid) {
      return json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.email, data.email),
        eq(users.userName, data.userName)
      )
    });

    if (existingUser) {
      return json(
        { error: 'A user with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const { hash, salt } = await hashPassword(data.password);

    // Create user
    const [newUser] = await db.insert(users).values({
      userName: data.userName,
      email: data.email,
      fullName: data.fullName || null,
      password: hash,
      salt,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }).returning({
      id: users.id,
      email: users.email,
      userName: users.userName,
      role: users.role,
      is_active: users.is_active
    });

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Ensure we have the latest user data
    const createdUser = await db.query.users.findFirst({
      where: eq(users.id, newUser.id)
    });

    if (!createdUser) {
      throw new Error('Failed to retrieve created user');
    }

    // Create session with non-null values
    const userRole = createdUser.role ?? 'user';
    const isUserActive = createdUser.is_active ?? true;

    const { session, cookie } = await createSession({
      id: createdUser.id,
      email: createdUser.email,
      userName: createdUser.userName,
      role: userRole === 'user' || userRole === 'admin' ? userRole : 'user',
      is_active: isUserActive
    });

    // Set session cookie
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24 * 30 // 30 days
    };

    // Return success response without sensitive data
    return json({
      success: true,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        userName: createdUser.userName,
        role: userRole,
        is_active: isUserActive
      }
    }, {
      status: 201,
      headers: {
        'Set-Cookie': cookie
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
};
