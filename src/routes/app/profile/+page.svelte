<script lang="ts">
  import { page } from '$app/stores';
  import { signOut } from '@auth/sveltekit/client';
  import { toast } from 'svelte-sonner';
  import { createForm, profileFormSchema } from '$lib/forms/superforms';
  import { FormField, FormTextarea, FormCheckbox, FormSelect, FormSubmit } from '$lib/components/forms';
  import ChangePasswordDialog from '$lib/components/profile/ChangePasswordDialog.svelte';
  import type { z } from 'zod';

  // Dialog open state
  let showChangePassword = $state(false);

  // Define the User type
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
    location?: string | null;
    timezone?: string | null;
    marketingEmails?: boolean;
  }
  
  // Define form data type using our schema
  type FormData = z.infer<typeof profileFormSchema>;

  // User data from session
  let user = $state<User | null>(null);

  // Form state with proper typing
  let isEditing = $state(false);
  
  // Get default timezone
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Available timezones for the select component
  const timezones = [
    { value: defaultTimezone, label: defaultTimezone },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ];

  // Initialize the form with our utility
  const { form, errors, enhance, submitting } = createForm({
    schema: profileFormSchema,
    validationMode: 'submit',
    successMessage: 'Profile updated successfully!',
    errorMessage: 'Failed to update profile. Please try again.',
    onSuccess: () => {
      isEditing = false;
    }
  });
  
  // Loading state for the submit button
  const isLoading = $derived($submitting);
  
  // Helper function to get error message for a field
  function getError(field: keyof FormData): string {
    if (!$errors[field]) return '';
    return Array.isArray($errors[field]) ? $errors[field][0] || '' : '';
  }
  
  // Update user when page data changes
  $effect(() => {
    // Type assertion for page data
    type PageData = { session?: { user?: User } };
    const pageData = $page.data as PageData | undefined;
    const sessionUser = pageData?.session?.user;
    
    if (sessionUser) {
      const updatedUser: User = {
        ...sessionUser,
        bio: sessionUser.bio ?? 'Travel enthusiast and adventure seeker',
        location: sessionUser.location ?? 'San Francisco, CA',
        timezone: sessionUser.timezone ?? defaultTimezone,
        marketingEmails: sessionUser.marketingEmails ?? false
      };
      
      user = updatedUser;
      
      // Update form data with non-null values
      $form = {
        name: updatedUser.name ?? '',
        email: updatedUser.email ?? '',
        bio: updatedUser.bio ?? 'Travel enthusiast and adventure seeker',
        location: updatedUser.location ?? 'San Francisco, CA',
        timezone: updatedUser.timezone ?? defaultTimezone,
        marketingEmails: updatedUser.marketingEmails ?? false
      };
    }
  });

  // Toggle edit mode
  function toggleEdit() {
    isEditing = !isEditing;
    if (!isEditing && user) {
      // Reset form data when canceling edit
      $form = {
        name: user.name ?? '',
        email: user.email ?? '',
        bio: user.bio ?? 'Travel enthusiast and adventure seeker',
        location: user.location ?? 'San Francisco, CA',
        timezone: user.timezone ?? defaultTimezone,
        marketingEmails: user.marketingEmails ?? false
      };
    }
  }

  // Handle form submission - now handled by the form component

  // Handle sign out
  function handleSignOut() {
    signOut({ callbackUrl: '/auth/signin' }).catch(error => {
      console.error('Error signing out:', error);
    });
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Profile</h1>
        <p class="text-gray-500">Manage your account settings</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Profile Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Profile Information</h2>

        <form method="POST" use:enhance class="space-y-4">
          <!-- Name field -->
          <FormField
            name="name"
            label="Name"
            type="text"
            bind:value={$form['name'] as string}
            disabled={!isEditing}
            error={getError('name')}
          />

          <!-- Email field (disabled) -->
          <FormField
            name="email"
            label="Email"
            type="email"
            bind:value={$form['email'] as string}
            disabled={true}
            error={getError('email')}
          />

          <!-- Bio field -->
          <FormTextarea
            name="bio"
            label="Bio"
            bind:value={$form['bio'] as string}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
            error={getError('bio')}
            rows={4}
          />

          <!-- Location field -->
          <FormField
            name="location"
            label="Location"
            type="text"
            bind:value={$form['location'] as string}
            disabled={!isEditing}
            error={getError('location')}
          />

          <!-- Timezone field -->
          <FormSelect
            name="timezone"
            label="Timezone"
            bind:value={$form['timezone'] as string}
            options={timezones}
            disabled={!isEditing}
            error={getError('timezone')}
          />
          
          <!-- Marketing emails checkbox -->
          <FormCheckbox
            name="marketingEmails"
            label="Receive marketing emails"
            bind:checked={$form['marketingEmails'] as boolean}
            disabled={!isEditing}
            error={getError('marketingEmails')}
          />

          <div class="flex space-x-4 pt-4">
            {#if isEditing}
              <FormSubmit
                label="Save Changes"
                variant="primary"
                size="md"
                loading={isLoading}
              />
              <button
                type="button"
                onclick={toggleEdit}
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            {:else}
              <button
                type="button"
                onclick={toggleEdit}
                class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Edit Profile
              </button>
            {/if}
            <button
              type="button"
              onclick={handleSignOut}
              class="px-4 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
            <!-- Change Password Button -->
            <button
              type="button"
              class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onclick={() => showChangePassword = true}
              aria-haspopup="dialog"
              aria-controls="change-password-dialog"
            >
              Change Password
            </button>
          </div>
          <!-- Change Password Dialog -->
          <ChangePasswordDialog
            bind:open={showChangePassword}
            onClose={() => (showChangePassword = false)}
            id="change-password-dialog"
          />
        </form>
      </div>
    </div>
  </div>
</div>
