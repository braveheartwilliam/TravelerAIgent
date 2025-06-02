<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { Loader2 } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { createForm, loginFormSchema } from '$lib/forms/superforms';
  import { FormField, FormCheckbox, FormSubmit } from '$lib/components/forms';
  import type { z } from 'zod';

  // Define PageData type based on the server response structure
  interface PageData {
    form: {
      data: {
        email: string;
        password: string;
        remember: boolean;
      }
    };
    error?: string;
  }

  // Define the form data type based on the schema
  type FormData = z.infer<typeof loginFormSchema>;

  // Get page data from props
  const { data } = $props<{ data: PageData }>();
  
  // State variables
  let isCheckingAuth = $state(true);
  let isAuthenticated = $state(false);
  let callbackUrl = $state('/');
  
  // Create form with our utility and schema
  // Define a custom type for the server response that includes success and redirectTo properties
  type AuthResponse = FormData & {
    success?: boolean;
    redirectTo?: string;
  };

  const { form, errors, enhance, submitting } = createForm({
    schema: loginFormSchema,
    data: data.form,
    successMessage: 'Signed in successfully!',
    errorMessage: 'Failed to sign in. Please check your credentials.',
    onSuccess: (result: AuthResponse) => {
      // Handle successful authentication and redirect
      if (result.success && result.redirectTo) {
        // Use a short timeout to allow the toast to show before redirecting
        setTimeout(() => {
          window.location.href = result.redirectTo || '/__protected__/dashboard';
        }, 300);
      }
    },
    validationMode: 'submit'
  });
  
  // Initialize form with default values using onMount to prevent reactivity loops
  onMount(() => {
    $form.email = $form.email || '';
    $form.password = $form.password || '';
    $form.remember = $form.remember ?? false;
  });
  
  // Loading state for the submit button
  const isLoading = $derived($submitting);
  
  // Helper function to get error message for a field
  function getError(field: keyof FormData): string {
    if (!$errors[field]) return '';
    return Array.isArray($errors[field]) ? $errors[field][0] || '' : '';
  }
  
  // Check authentication status and handle redirects
  async function checkAuth() {
    // Skip auth check on server-side
    if (typeof window === 'undefined') return false;
    
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data?.user) {
          isAuthenticated = true;
          // Get the callback URL from the query parameters
          const urlParams = new URLSearchParams(window.location.search);
          let redirectTo = urlParams.get('callbackUrl') || '/';
          
          // Ensure the redirect URL is safe and relative
          if (redirectTo && redirectTo.startsWith('/')) {
            try {
              const url = new URL(redirectTo, window.location.origin);
              if (url.origin === window.location.origin) {
                // Use a small delay to ensure any UI updates are processed
                setTimeout(() => {
                  window.location.href = redirectTo;
                }, 100);
                return true;
              }
            } catch (e) {
              console.error('Invalid redirect URL:', e);
            }
          }
          
          // Default redirect
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error checking auth status:', err);
      return false;
    } finally {
      isCheckingAuth = false;
    }
  }

  // Handle page initialization
  onMount(async () => {
    // Get callback URL from query params
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('callbackUrl') || urlParams.get('from');
    
    if (redirectUrl && redirectUrl.startsWith('/')) {
      callbackUrl = redirectUrl;
    }

    // Check if user is already authenticated
    const isAuthed = await checkAuth();
    if (isAuthed) return;

    // Show messages from URL parameters
    if (urlParams.get('message') === 'signed_out') {
      toast.success('You have been successfully signed out');
    }

    // Show error message if present in URL
    const errorParam = urlParams.get('error');
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'invalid_credentials': 'Invalid email or password',
        'session_expired': 'Your session has expired. Please sign in again.',
        'invalid_session': 'Your session is invalid. Please sign in again.',
        'account_locked': 'Your account has been locked. Please contact support.',
        'account_not_verified': 'Please verify your email address before signing in.'
      };
      
      const errorMessage = errorMessages[errorParam] || 
        'An error occurred during sign in. Please try again.';
      
      toast.error(errorMessage);
    }

    // Show form after checking authentication
    isCheckingAuth = false;
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  {#if isCheckingAuth}
    <div class="text-center p-8">
      <p class="text-gray-600 mb-4">
        {isAuthenticated ? 'Redirecting to dashboard...' : 'Checking authentication...'}
      </p>
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>
  {:else}
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <h3 class="text-center text-lg text-gray-700">
          Sign in to your account
        </h3>
        <p class="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up here
          </a>
        </p>
      </div>
      
      <form 
        method="POST"
        use:enhance
        class="mt-8 space-y-6"
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div class="space-y-4">
          <!-- Email -->
          <FormField
            name="email"
            label="Email address"
            type="email"
            autocomplete="email"
            required
            bind:value={$form['email'] as string}
            error={getError('email')}
          />
          
          <!-- Password -->
          <FormField
            name="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={$form['password'] as string}
            error={getError('password')}
          />
        </div>

        <div class="flex items-center justify-between">
          <FormCheckbox
            name="remember"
            label="Remember me"
            bind:checked={$form['remember'] as boolean}
            error={getError('remember')}
          />

          <div class="text-sm">
            <a href="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <FormSubmit
            label="Sign in"
            loading={isLoading}
            variant="primary"
            size="md"
          />
        </div>
        
        <div class="text-sm text-center mt-6">
          <div class="flex items-center justify-center space-x-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <p class="text-gray-600 font-medium">
              Protected by TravelerAIgent security
            </p>
          </div>
          <p class="text-gray-500 text-xs">
            Your connection is encrypted and your data is secure
          </p>
        </div>
      </form>
    </div>
  {/if}
</div>
