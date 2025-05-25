import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

/**
 * Middleware to protect API routes that require authentication
 * @param handler The route handler to protect
 * @returns A protected route handler
 */
export function requireAuth(handler: RequestHandler): RequestHandler {
  return async (event) => {
    const user = event.locals.user;
    
    if (!user) {
      return json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return handler(event);
  };
}

/**
 * Middleware to protect API routes that require a specific role
 * @param roles Array of allowed roles
 * @param handler The route handler to protect
 * @returns A protected route handler
 */
export function requireRole(roles: string[], handler: RequestHandler): RequestHandler {
  return async (event) => {
    const user = event.locals.user;
    
    if (!user) {
      return json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!roles.includes(user.role || '')) {
      return json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    return handler(event);
  };
}
