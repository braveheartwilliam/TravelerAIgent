import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export interface ActionData {
  success: boolean;
  redirect: string;
  error?: string;
  form?: {
    data: {
      email: string;
      password: string;
      remember: boolean;
    };
    errors?: Record<string, string[]>;
    message?: string;
  };
}

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.getSession?.();
  if (session) {
    throw redirect(303, url.searchParams.get('callbackUrl') || '/dashboard');
  }

  return {
    form: {
      data: {
        email: '',
        password: '',
        remember: false
      }
    },
    error: url.searchParams.get('error') || undefined
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const remember = formData.get('remember') === 'true';
    const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard';

    try {
      const { error } = await locals.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          redirect: callbackUrl,
          error: 'Invalid email or password',
        };
      }

      return {
        success: true,
        redirect: callbackUrl,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        redirect: callbackUrl,
        error: 'An error occurred during sign in. Please try again.',
      };
    }
  },
};
