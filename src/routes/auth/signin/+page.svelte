<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { Loader2, Mail } from 'lucide-svelte';
  import { onMount } from 'svelte';
  
  // Form state
  let email = '';
  let password = '';
  let rememberMe = false;
  let isLoading = false;
  let error = '';
  let callbackUrl = '/';
  
  // Get callback URL from query params
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('callbackUrl');
    
    if (redirectUrl) {
      callbackUrl = redirectUrl;
    }
    
    // Show error message if present in URL
    const errorParam = urlParams.get('error');
    if (errorParam === 'invalid_credentials') {
      error = 'Invalid email or password';
      toast.error(error);
    } else if (errorParam === 'session_error') {
      error = 'Session expired. Please sign in again.';
      toast.error(error);
    }
  });
  
  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Reset state
    error = '';
    isLoading = true;
    
    // Basic validation
    if (!email || !password) {
      error = 'Please fill in all fields';
      toast.error(error);
      isLoading = false;
      return;
    }
    
    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error = 'Please enter a valid email address';
      toast.error(error);
      isLoading = false;
      return;
    }
    
    try {
      console.log('Sending sign-in request...');
      
      // Get the current origin for CORS
      const origin = window.location.origin;
      
      // Make sure we're using the correct URL (no trailing slash)
      const apiUrl = '/api/auth/signin';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': origin
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
          callbackUrl: '/'
        }),
        credentials: 'include',
        redirect: 'manual' // Prevent automatic redirects
      });
      
      // Handle different response types
      const contentType = response.headers.get('content-type') || '';
      let responseData;
      
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error('Unexpected response format:', text);
        throw new Error('Unexpected response from server');
      }
      
      // Check if the response indicates success
      if (response.ok) {
        console.log('Sign-in successful:', responseData);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('Session cookie:', document.cookie);
        
        toast.success('Signed in successfully!');
        
        // Verify the redirect URL
        const redirectUrl = responseData.redirect || '/__protected__/dashboard';
        console.log('Preparing to redirect to:', redirectUrl);
        
        // Use a small timeout to ensure the toast is visible
        setTimeout(() => {
          console.log('Initiating redirect to:', redirectUrl);
          window.location.href = redirectUrl;
        }, 500);
      } else {
        // Handle error response
        console.error('Sign-in failed:', response.status, responseData);
        throw new Error(responseData.error || 'Authentication failed');
      }
    
      
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while signing in';
      toast.error(errorMessage);
      error = errorMessage;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
</div>
