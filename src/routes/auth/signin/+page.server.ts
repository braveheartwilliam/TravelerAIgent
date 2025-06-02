import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

// Define the login schema with proper validation messages
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
  callbackUrl: z.string().optional()
});

type ErrorKey = 'OAuthCallbackError' | 'OAuthSignin' | 'OAuthAccountNotLinked' | 'SessionRequired' | 'CredentialsSignin' | 'Default';

const errorMessages: Record<ErrorKey, string> = {
  OAuthCallbackError: 'Authentication failed. Please try again.',
  OAuthSignin: 'Error in authentication process. Please try again.',
  OAuthAccountNotLinked: 'This email is already associated with another account.',
  SessionRequired: 'Please sign in to access this page.',
  CredentialsSignin: 'Invalid email or password',
  Default: 'An error occurred during authentication. Please try again.'
} as const;

export const load: ServerLoad = async ({ locals, url }: { locals: App.Locals; url: URL }) => {
  const session = await locals.getSession?.();
  if (session) {
    throw redirect(303, url.searchParams.get('callbackUrl') || '/__protected__/dashboard');
  }

  const form = await superValidate(zod(loginSchema));
  const error = url.searchParams.get('error') as ErrorKey | null;
  const errorMessage = error && error in errorMessages 
    ? errorMessages[error as keyof typeof errorMessages] 
    : null;

  return {
    form,
    error: errorMessage
  };
};

export const actions = {
  default: async ({ request, fetch }: { request: Request, fetch: typeof globalThis.fetch }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return message(form, 'Please check your input and try again', { status: 400 });
    }

    // Authentication process - separate from redirect logic
    const authResult = await authenticateUser(form.data, fetch);
    
    if (authResult.success) {
      // Return success with form data - this will be processed by SuperForms
      return {
        form,
        success: true,
        redirectTo: authResult.redirectUrl
      };
    } else {
      // Return error message
      return message(form, authResult.errorMessage || 'Authentication failed', { status: 400 });
    }
  }
} satisfies Actions;

// Helper function to handle authentication
async function authenticateUser(formData: any, fetch: typeof globalThis.fetch) {
  try {
    // Use better-auth API for authentication as per memory guidance
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        remember: formData.remember || false,
        callbackUrl: formData.callbackUrl || '/__protected__/dashboard'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        errorMessage: data?.message || 'Authentication failed'
      };
    }

    // Get the callback URL from the response or use the default
    let redirectUrl = formData.callbackUrl || '/__protected__/dashboard';
    
    try {
      if (data?.url) {
        const url = new URL(data.url);
        const urlCallback = url.searchParams.get('callbackUrl');
        if (urlCallback) {
          redirectUrl = urlCallback;
        }
      }
    } catch (e) {
      console.error('Error parsing callback URL:', e);
    }
    
    // Return success result
    return {
      success: true,
      redirectUrl
    };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      errorMessage: 'An error occurred during authentication. Please try again.'
    };
  }
}
