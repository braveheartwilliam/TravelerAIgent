import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '$lib/server/session-utils';
import { hashPassword } from '$lib/server/auth-utils';

interface SignUpRequest {
  email: string;
  userName: string;
  password: string;
  fullName?: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    console.log('Signup request received');
    
    // Check content type to handle both JSON and form data
    const contentType = request.headers.get('content-type') || '';
    let requestData: Partial<SignUpRequest> = {};
    
    if (contentType.includes('application/json')) {
      // Handle JSON data
      try {
        requestData = await request.json();
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return json({ error: 'Invalid JSON in request body' }, { status: 400 });
      }
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data
      const formData = await request.formData();
      requestData = {
        email: formData.get('email') as string,
        userName: formData.get('userName') as string,
        password: formData.get('password') as string,
        fullName: formData.get('fullName') as string
      };
      
      // Log form data for debugging
      console.log('Form data received:', Object.fromEntries(formData.entries()));
    } else {
      return json({ error: 'Unsupported content type' }, { status: 415 });
    }
    
    const { email, userName, password, fullName } = requestData;

    // Validate required fields
    if (!email || !userName || !password) {
      return json({ error: 'Email, username, and password are required' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));

    if (existingUser) {
      return json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Check if username is taken
    const [existingUserName] = await db
      .select()
      .from(users)
      .where(eq(users.userName, userName.trim()));

    if (existingUserName) {
      return json({ error: 'Username is already taken' }, { status: 409 });
    }

    // Hash the password
    const { hash: hashedPassword, salt } = await hashPassword(password);

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        userName: userName.trim(),
        password: hashedPassword,
        salt,
        fullName: fullName?.trim() || null,
        is_active: true,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();

    if (!newUser) {
      throw error(500, 'Failed to create user');
    }

    // Create a session for the new user
    const { session: sessionData, cookie: sessionCookie } = createSession({
      id: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
      role: 'user',
      is_active: true,
      name: newUser.fullName || newUser.userName,
      createdAt: newUser.created_at || new Date(),
      updatedAt: newUser.updated_at || new Date()
    });

    // Return success response with user data (excluding sensitive fields)
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
      fullName: newUser.fullName,
      role: newUser.role,
      is_active: newUser.is_active,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at
    };

    return new Response(JSON.stringify({
      success: true,
      user: userResponse,
      redirect: '/__protected__/dashboard'
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (err: unknown) {
    console.error('Sign up error:', err);
    
    if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
      const errorWithBody = err as { body?: { message?: string } };
      return json({ error: errorWithBody.body?.message || 'Bad request' }, { status: 400 });
    }
    
    return json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
