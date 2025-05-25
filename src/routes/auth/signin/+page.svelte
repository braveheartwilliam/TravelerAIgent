<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { Loader2, Mail } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Form state
  let email = '';
  let isAuthenticated = false;
  let isCheckingAuth = true;
  let password = '';
  let rememberMe = false;
  let isLoading = false;
  let error = '';
  let callbackUrl = '/';
  
  // Check authentication status and handle redirects
  async function checkAuth() {
    // Skip auth check on server-side
    if (typeof window === 'undefined') return false;
    
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          isAuthenticated = true;
          // Get the callback URL from the query parameters
          const urlParams = new URLSearchParams(window.location.search);
          let redirectTo = urlParams.get('callbackUrl');
          
          // Ensure the redirect URL is safe and relative
          if (!redirectTo || !redirectTo.startsWith('/')) {
            redirectTo = '/__protected__/dashboard';
          } else {
            // Basic validation to prevent open redirects
            try {
              const url = new URL(redirectTo, window.location.origin);
              if (url.origin !== window.location.origin) {
                console.warn('Invalid redirect URL, using default');
                redirectTo = '/__protected__/dashboard';
              }
            } catch (e) {
              console.warn('Invalid redirect URL, using default:', e);
              redirectTo = '/__protected__/dashboard';
            }
          }
          
          // Use a small delay to ensure any UI updates are processed
          setTimeout(() => {
            console.log('Redirecting to:', redirectTo);
            window.location.href = redirectTo;
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

  // Get callback URL from query params and check auth status
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('callbackUrl');
    
    if (redirectUrl) {
      callbackUrl = redirectUrl;
    }
    
    // Check if user is already authenticated
    const isAuthed = await checkAuth();
    if (isAuthed) return;
    
    // Show error message if present in URL
    const errorParam = urlParams.get('error');
    if (errorParam === 'invalid_credentials') {
      error = 'Invalid email or password';
      toast.error(error);
    } else if (errorParam === 'session_error') {
      error = 'Session expired. Please sign in again.';
      toast.error(error);
    } else {
      isCheckingAuth = false;
    }
  });
  
  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Reset state
    error = '';
    isLoading = true;
    
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      // Email format validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      console.log('Sending sign-in request...');
      
      // Get the callback URL from query params or use default
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('callbackUrl') || '/__protected__/dashboard';
      
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
            rememberMe,
            callbackUrl: redirectTo
          }),
          credentials: 'include' // Important: include cookies for session
        });
        
        const responseData = await response.json();
        
        if (response.ok && responseData.success) {
          console.log('Sign-in successful:', responseData);
          toast.success('Signed in successfully!');
          
          // Use the redirect URL from the response or fallback
          const redirectUrl = responseData.redirectTo || redirectTo;
          console.log('Preparing to redirect to:', redirectUrl);
          
          // Set authenticated state
          isAuthenticated = true;
          
          // Clear any previous session data
          localStorage.removeItem('session');
          
          // Use a small timeout to ensure the toast is visible
          setTimeout(() => {
            console.log('Initiating redirect to:', redirectUrl);
            // Force a hard redirect to ensure session is properly set
            window.location.href = redirectUrl;
          }, 300);
        } else {
          // Handle error response
          console.error('Sign-in failed:', response.status, responseData);
          throw new Error(responseData.error || 'Authentication failed');
        }
      } catch (err) {
        console.error('Network error during sign-in:', err);
        throw new Error('Unable to connect to the server. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while signing in';
      toast.error(errorMessage);
      error = errorMessage;
      isCheckingAuth = false;
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  {#if isCheckingAuth}
    <div class="text-center p-8">
      <p class="text-gray-600 mb-4">
        {isAuthenticated ? 'Redirecting to dashboard...' : 'Checking authentication...'}
      </p>
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>
  {:else}
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/auth/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up here
        </a>
      </p>
    </div>
    
    {#if error}
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    {/if}
    
    <form 
      class="mt-8 space-y-6" 
      on:submit|preventDefault={handleSubmit}
    >
      <input type="hidden" name="remember" value="true" />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            disabled={isLoading}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            bind:checked={rememberMe}
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            <Loader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Signing in...
          {:else}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Mail class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
            </span>
            Sign in with Email
          {/if}
        </button>
      </div>
    </form>
  </div>
  {/if}
</div>
