import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from '$lib/server/session-utils';
import type { SessionData as ServerSessionData } from '$lib/server/session-utils';

// Interface for the user data in the database
export interface DatabaseUser {
  id: number;
  userName: string;
  email: string;
  fullName: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  [key: string]: unknown; // For any additional properties
}

// Interface for the session user data
export interface SessionUser {
  id: number;
  email: string;
  name: string | null;
  userName: string;
  fullName: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown; // Allow additional properties
}

// Interface for the session response
interface SessionResponse {
  user: SessionUser | null;
  isAuthenticated: boolean;
  error?: string | null;
}

// Interface for the session data in the cookie
export interface SessionData {
  id: number;
  email: string;
  name?: string | null;
  userName: string;
  fullName?: string | null;
  role?: 'user' | 'admin';
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  expires?: string;
}

// Helper function to set CORS headers
function setCorsHeaders(request: Request, additionalHeaders: Record<string, string> = {}) {
  const origin = request.headers.get('origin');
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...additionalHeaders
  };
}

// Handle OPTIONS requests for CORS preflight
export const OPTIONS: RequestHandler = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(request, {
      'Access-Control-Max-Age': '86400' // 24 hours
    })
  });
};

export const GET: RequestHandler = async ({ locals, request, cookies }) => {
  try {
    // Initialize response data
    const responseData: SessionResponse = {
      user: null,
      isAuthenticated: false,
      error: null
    };
    
    // Check for user in locals (set by handleAuth)
    const user = locals?.user as Record<string, unknown> | null;
    
    // If we have a user in locals, use that data
    if (user) {
      // Create a safe user data object with proper type assertions
      const safeUserData = user as Record<string, any>;
      
      // Safely access properties with type assertions and fallbacks
      const userData: SessionUser = {
        id: Number(safeUserData['id'] || 0),
        email: String(safeUserData['email'] || ''),
        name: safeUserData['name'] !== undefined ? String(safeUserData['name']) : null,
        userName: String(safeUserData['userName'] || (typeof safeUserData['email'] === 'string' ? safeUserData['email'].split('@')[0] : 'user')),
        fullName: safeUserData['fullName'] !== undefined ? String(safeUserData['fullName']) : null,
        role: (safeUserData['role'] === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        is_active: safeUserData['is_active'] !== false,
        createdAt: String(
          safeUserData['createdAt'] || 
          safeUserData['created_at'] || 
          new Date().toISOString()
        ),
        updatedAt: String(
          safeUserData['updatedAt'] || 
          safeUserData['updated_at'] || 
          new Date().toISOString()
        )
      };
      
      // Validate required fields
      if (!userData.id || !userData.email) {
        throw new Error('Invalid user data in session');
      }
      
      responseData.user = userData;
      responseData.isAuthenticated = true;
      
      console.log('Returning user from locals:', {
        id: userData.id,
        email: userData.email,
        userName: userData.userName,
        role: userData.role
      });
      
      return json(responseData, { 
        status: 200,
        headers: setCorsHeaders(request)
      });
    }
    
    // Fallback to checking session cookie if no user in locals
    const sessionToken = cookies.get('session');
    if (sessionToken) {
      try {
        console.log('Session token found, validating session');
        
        // Get the session using the session utility
        const session = await getSession(cookies);
        
        if (session?.user) {
          const user = session.user;
          console.log('Found valid session for user:', { id: user.id, email: user.email });
          
          // Create the response with user data
          // Create the server-side session data
          const serverSession: ServerSessionData = {
            id: session.id,
            user: {
              id: user.id,
              email: user.email,
              userName: user.userName,
              fullName: user.fullName,
              role: user.role as 'user' | 'admin',
              is_active: user.is_active !== false,
              created_at: user.created_at,
              updated_at: user.updated_at
            },
            expiresAt: session.expiresAt,
            createdAt: session.createdAt
          };
          
          // Create the response with properly typed user data
          const responseData: SessionResponse = {
            user: {
              id: String(user.id),
              email: user.email,
              name: user.fullName || null,
              userName: user.userName,
              fullName: user.fullName || null,
              role: user.role as 'user' | 'admin',
              is_active: user.is_active !== false,
              createdAt: user.created_at instanceof Date ? user.created_at.toISOString() : String(user.created_at || new Date().toISOString()),
              updatedAt: user.updated_at instanceof Date ? user.updated_at.toISOString() : String(user.updated_at || new Date().toISOString())
            },
            isAuthenticated: true,
            session: serverSession as any // Safe cast as we've validated the data
          };
          
          // Set the user in locals for subsequent requests
          // Convert the user data to match the expected SessionUser type
          locals.user = {
            ...responseData.user,
            id: user.id, // Keep the numeric ID for server-side
            created_at: user.created_at instanceof Date ? user.created_at : new Date(user.created_at || Date.now()),
            updated_at: user.updated_at instanceof Date ? user.updated_at : new Date(user.updated_at || Date.now())
          } as any; // Safe cast as we're ensuring the data structure matches
          
          return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: setCorsHeaders(request)
          });
        }
      } catch (error) {
        console.error('Error validating session:', error);
        // Clear invalid session cookie
        cookies.delete('session', { path: '/' });
      }
    }
    
    // Prepare response headers
    const headers = setCorsHeaders(request);
    
    if (!user) {
      console.log('No user found in session');
      return json(
        { 
          user: null, 
          isAuthenticated: false,
          timestamp: new Date().toISOString()
        },
        { 
          status: 200,
          headers 
        }
      );
    }
    
    // Safely extract user data with defaults using type-safe access
    const safeUser = user as Record<string, any>;
    const userId = safeUser?.['id'] || 0;
    const userEmail = safeUser?.['email'] || '';
    const userName = safeUser?.['userName'] || userEmail.split('@')[0] || 'user';
    const fullName = safeUser?.['fullName'] !== undefined ? safeUser['fullName'] : null;
    const userRole = safeUser?.['role'] || 'user';
    const isActive = safeUser?.['is_active'] !== false; // Default to true if not set
    
    // Log the user data we found
    console.log('User found in session:', {
      id: userId,
      email: userEmail,
      userName: userName
    });
    
    // Format dates safely
    const now = new Date().toISOString();
    const createdAt = safeUser?.['created_at'] 
      ? new Date(safeUser['created_at']).toISOString() 
      : now;
    const updatedAt = safeUser?.['updated_at'] 
      ? new Date(safeUser['updated_at']).toISOString() 
      : now;
    
    // Return the user data without sensitive information
    const userData = {
      id: userId,
      email: userEmail,
      name: fullName || userName || userEmail.split('@')[0],
      userName: userName,
      fullName: fullName,
      role: userRole,
      is_active: isActive,
      createdAt: createdAt,
      updatedAt: updatedAt
    };

    console.log('Returning user data:', userData);
    
    return json({
      user: userData,
      isAuthenticated: true
    }, { headers });
  } catch (error) {
    console.error('Session error:', error);
    return json(
      { user: null, isAuthenticated: false, error: 'Failed to get session' },
      { status: 500, headers: setCorsHeaders(request) }
    );
  }
};
