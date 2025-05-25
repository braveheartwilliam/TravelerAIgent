<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import { zod } from 'sveltekit-superforms/adapters';
  import { signupSchema } from '$lib/schemas/auth';
  import { onMount } from 'svelte';

  export let data: PageData;

  const { form, errors, enhance, message } = superForm(data.form, {
    validators: zod(signupSchema),
    onError: ({ result }) => {
      // Handle form validation errors
      $message = {
        type: 'error',
        text: result.error?.message || 'Please fix the form errors.'
      };
    },
    onSubmit: async ({ cancel }) => {
      cancel(); // Cancel the default form submission
      
      const formData = new FormData();
      formData.append('userName', $form.userName);
      formData.append('fullName', $form.fullName);
      formData.append('email', $form.email);
      formData.append('password', $form.password);
      formData.append('confirmPassword', $form.confirmPassword);
      
      try {
        console.log('Submitting signup form...');
        const response = await fetch('/auth/signup', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include' // Important for cookies
        });
        
        console.log('Signup response status:', response.status);
        
        // Handle successful response
        if (response.ok) {
          const result = await response.json();
          console.log('Signup successful:', result);
          
          // Redirect to dashboard or home page
          window.location.href = '/';
          return;
        }
        
        // Handle error response
        try {
          const errorData = await response.json();
          console.error('Signup error response:', errorData);
          
          $message = {
            type: 'error',
            text: errorData.error || errorData.message || 'An error occurred during signup.'
          };
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          $message = {
            type: 'error',
            text: `Server error: ${response.status} ${response.statusText}`
          };
        }
      } catch (error) {
        console.error('Signup request failed:', error);
        $message = {
          type: 'error',
          text: 'Failed to connect to the server. Please check your connection and try again.'
        };
      }
    }
  });

  // Helper function to get error message for a field
  function getError(field: string): string | undefined {
    const fieldErrors = errors[field];
    return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined;
  }

  // Initialize form with default values
  onMount(() => {
    $form.userName = $form.userName || '';
    $form.fullName = $form.fullName || '';
    $form.email = $form.email || '';
    $form.password = ''; // Always clear password fields on mount
    $form.confirmPassword = '';
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
    </div>
    
    {#if $message}
      <div class="rounded-md p-4 mb-4 { $message.type === 'error' ? 'bg-red-50' : 'bg-green-50' }">
        <div class="flex">
          <div class="flex-shrink-0">
            {#if $message.type === 'error'}
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            {:else}
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            {/if}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium {$message.type === 'error' ? 'text-red-800' : 'text-green-800'}">
              {$message.text}
            </p>
          </div>
        </div>
      </div>
    {/if}
    
    <form method="POST" use:enhance class="space-y-6">
      <div class="space-y-4">
        <!-- Username -->
        <div>
          <label for="userName" class="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div class="mt-1">
            <input
              id="userName"
              name="userName"
              type="text"
              autocomplete="username"
              required
              bind:value={$form.userName}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="johndoe"
            />
          </div>
          {#if getError('userName')}
            <p class="mt-2 text-sm text-red-600" id="userName-error">
              {getError('userName')}
            </p>
          {/if}
        </div>

        <!-- Full Name -->
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div class="mt-1">
            <input
              id="fullName"
              name="fullName"
              type="text"
              autocomplete="name"
              required
              bind:value={$form.fullName}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>
          {#if getError('fullName')}
            <p class="mt-2 text-sm text-red-600" id="fullName-error">
              {getError('fullName')}
            </p>
          {/if}
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              bind:value={$form.email}
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              class:border-red-500={!!getError('email')}
              aria-invalid={!!getError('email') ? 'true' : 'false'}
              aria-describedby="email-error"
            />
          </div>
          {#if getError('email')}
            <p class="mt-2 text-sm text-red-600" id="email-error">
              {getError('email')}
            </p>
          {/if}
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              bind:value={$form.password}
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              class:border-red-500={!!getError('password')}
              aria-invalid={!!getError('password') ? 'true' : 'false'}
              aria-describedby="password-error"
            />
          </div>
          {#if getError('password')}
            <p class="mt-2 text-sm text-red-600" id="password-error">
              {getError('password')}
            </p>
          {/if}
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div class="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              bind:value={$form.confirmPassword}
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              class:border-red-500={!!getError('confirmPassword')}
              aria-invalid={!!getError('confirmPassword') ? 'true' : 'false'}
              aria-describedby="confirm-password-error"
            />
          </div>
          {#if getError('confirmPassword')}
            <p class="mt-2 text-sm text-red-600" id="confirm-password-error">
              {getError('confirmPassword')}
            </p>
          {/if}
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign up
        </button>
      </div>

      <div class="text-sm text-center">
        <p class="text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </form>
  </div>
</div>
