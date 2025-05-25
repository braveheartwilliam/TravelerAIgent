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
  default: async ({ request }: { request: Request }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return message(form, 'Please check your input and try again', { status: 400 });
    }

    try {
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.data.email,
          password: form.data.password,
          redirect: false,
          callbackUrl: form.data.callbackUrl || '/dashboard'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data?.message || 'Authentication failed';
        return message(form, errorMessage, { status: 400 });
      }

      // Get the callback URL from the response or use the default
      let callbackUrl = form.data.callbackUrl || '/dashboard';
      
      try {
        if (data?.url) {
          const url = new URL(data.url);
          const urlCallback = url.searchParams.get('callbackUrl');
          if (urlCallback) {
            callbackUrl = urlCallback;
          }
        }
      } catch (e) {
        console.error('Error parsing callback URL:', e);
      }

      // Return success response with redirect URL
      return {
        success: true,
        redirect: callbackUrl
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return message(
        form, 
        'An error occurred during authentication. Please try again.', 
        { status: 400 }
      );
    }
  }
} satisfies Actions;
