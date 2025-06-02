<script lang="ts">
  import { createForm } from '$lib/forms/superforms';
  import { registrationFormSchema } from '$lib/forms/superforms';
  import { FormField, FormCheckbox, FormSubmit } from '$lib/components/forms';
  import { toast } from 'svelte-sonner';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import type { z } from 'zod';
  
  // Define the form data type based on the schema
  type FormData = z.infer<typeof registrationFormSchema>;

  const { data } = $props<{ data: PageData }>();

  // Create form with our utility and schema
  const { form, errors, enhance, submitting } = createForm({
    schema: registrationFormSchema,
    data: data.form,
    successMessage: 'Account created successfully!',
    errorMessage: 'Please fix the form errors.',
    resetAfterSubmit: false,
    onSuccess: () => {
      // Redirect to login page after successful registration
      window.location.href = '/auth/signin';
    },
    validationMode: 'change'
  });
  
  // Loading state for the submit button
  const isLoading = $derived($submitting);
      
  // Helper function to get error message for a field
  function getError(field: keyof FormData): string {
    if (!$errors[field]) return '';
    return Array.isArray($errors[field]) ? $errors[field][0] || '' : '';
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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Join TravelerAIgent
      </h2>
      <h3 class="text-center text-lg text-gray-700">
        Create your account to get started
      </h3>
    </div>
    
    <!-- Alert messages are now handled by the toast component -->
    
    <form method="POST" use:enhance class="space-y-6">
      <div class="space-y-4">
        <!-- Username -->
        <FormField
          name="userName"
          label="Username"
          type="text"
          autocomplete="username"
          required
          bind:value={$form['userName']}
          error={getError('userName')}
        />

        <!-- Full Name -->
        <FormField
          name="fullName"
          label="Full Name"
          type="text"
          autocomplete="name"
          required
          bind:value={$form['fullName']}
          placeholder="John Doe"
          error={getError('fullName')}
        />

        <!-- Email -->
        <FormField
          name="email"
          label="Email address"
          type="email"
          autocomplete="email"
          required
          bind:value={$form['email']}
          error={getError('email')}
        />

        <!-- Password -->
        <FormField
          name="password"
          label="Password"
          type="password"
          autocomplete="new-password"
          required
          bind:value={$form['password']}
          error={getError('password')}
        />

        <!-- Confirm Password -->
        <FormField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          autocomplete="new-password"
          required
          bind:value={$form['confirmPassword']}
          error={getError('confirmPassword')}
        />
        
        <!-- Accept Terms -->
        <FormCheckbox
          name="acceptTerms"
          label="I accept the terms and conditions"
          required
          bind:checked={$form['acceptTerms']}
          error={getError('acceptTerms')}
        />
      </div>

      <div>
        <FormSubmit
          label="Sign up"
          loading={isLoading}
          variant="primary"
          size="md"
        />
      </div>

      <div class="text-sm text-center">
        <p class="text-gray-600">
          Already have an account?{' '}
          <a href="/auth/signin" class="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </p>
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
</div>
