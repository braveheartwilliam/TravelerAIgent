# Authentication Implementation (as of 2025-05-25)

## Table of Contents
1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Session Management](#session-management)
4. [User Management](#user-management)
5. [Protected Routes](#protected-routes)
6. [API Endpoints](#api-endpoints)
7. [Security Considerations](#security-considerations)
8. [Error Handling](#error-handling)

## Overview
The application uses a custom authentication system built with SvelteKit, utilizing server-side sessions and secure cookies. The implementation follows security best practices and includes features like password hashing, CSRF protection, and secure session management.

## Authentication Flow

### Signup Process
1. User submits registration form with email, username, and password
2. Server validates input and checks for existing users
3. Password is hashed with a unique salt
4. New user is created in the database
5. Session is created and set in HTTP-only cookie
6. User is redirected to dashboard

### Signin Process
1. User submits login form with email/username and password
2. Server verifies credentials against stored hash
3. On success, a new session is created
4. Session ID is stored in HTTP-only cookie
5. User is redirected to dashboard or requested URL

### Signout Process
1. User initiates signout
2. Server invalidates the current session
3. Session cookie is cleared
4. User is redirected to signin page

## Session Management

### Session Creation
- Sessions are created using `createSession` in `session-utils.ts`
- Each session includes:
  - Unique session ID
  - User ID and basic user info
  - Expiration timestamp
  - Creation timestamp

### Session Storage
- Sessions are stored in the database with an expiration time
- Session ID is stored in an HTTP-only, secure, same-site cookie
- Default session duration: 30 days

### Session Validation
- Middleware checks for valid session on protected routes
- Sessions are validated against the database on each request
- Expired or invalid sessions are automatically cleared

## User Management

### Password Hashing
- Uses Node.js `crypto.scrypt` for secure password hashing
- Each password is hashed with a unique 16-byte salt
- Hash iterations are optimized for security (N=16384, r=8, p=1)

### User Data
- User data follows consistent naming conventions (camelCase)
- Required fields: `id`, `email`, `userName`, `password`, `role`
- Optional fields: `fullName`, `isActive`, etc.

## Protected Routes

### Route Protection
- Protected routes are prefixed with `/__protected__/`
- Middleware checks for valid session
- Unauthenticated users are redirected to signin page
- Original destination is preserved in `callbackUrl`

### Role-Based Access
- User roles: `user` or `admin`
- Role checks are implemented in route load functions
- Unauthorized access attempts are logged and blocked

## API Endpoints

### Auth Endpoints
- `POST /api/auth/signin` - Handle user login
- `POST /api/auth/signup` - Handle user registration
- `POST /api/auth/signout` - Handle user logout
- `GET /api/auth/session` - Get current session info

### User Endpoints
- `GET /api/user` - Get current user data
- `PATCH /api/user` - Update user data
- `DELETE /api/user` - Delete user account

## Security Considerations

### Cookie Security
- `HttpOnly` flag prevents XSS attacks
- `Secure` flag ensures HTTPS-only in production
- `SameSite=Lax` prevents CSRF attacks
- Domain and path restrictions are applied

### Password Security
- Strong password requirements (min length, complexity)
- Passwords are never logged or exposed in responses
- Rate limiting on authentication endpoints
- Account lockout after failed attempts

### Session Security
- Session tokens are cryptographically secure
- Sessions expire after inactivity
- Multiple concurrent sessions are supported but can be limited

## Error Handling

### Authentication Errors
- Invalid credentials: 401 Unauthorized
- Expired session: 403 Forbidden
- Missing permissions: 403 Forbidden
- Validation errors: 400 Bad Request

### User Feedback
- Clear error messages for common issues
- No exposure of system details in production
- Logging of security-relevant events

## Dependencies
- `crypto` - Node.js built-in for cryptographic operations
- `drizzle-orm` - Database ORM for session storage
- `@sveltejs/kit` - Web framework with session handling

## Future Improvements
- Implement multi-factor authentication
- Add social login providers
- Enhance session management with refresh tokens
- Add security headers middleware
