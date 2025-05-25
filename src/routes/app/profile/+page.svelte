<script lang="ts">
  import { page } from '$app/stores';
  import { signOut } from '@auth/sveltekit/client';

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
  
  // Define form data type
  interface FormData {
    name: string;
    email: string;
    bio: string;
    location: string;
    timezone: string;
    marketingEmails: boolean;
  }

  // User data from session
  let user = $state<User | null>(null);

  // Form state with proper typing
  let isEditing = $state(false);
  
  // Get default timezone
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Initialize form data with defaults
  let formData = $state<FormData>({
    name: '',
    email: '',
    bio: 'Travel enthusiast and adventure seeker',
    location: 'San Francisco, CA',
    timezone: defaultTimezone,
    marketingEmails: false
  });

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
      formData = {
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
      formData = {
        name: user.name ?? '',
        email: user.email ?? '',
        bio: user.bio ?? 'Travel enthusiast and adventure seeker',
        location: user.location ?? 'San Francisco, CA',
        timezone: user.timezone ?? defaultTimezone,
        marketingEmails: user.marketingEmails ?? false
      };
    }
  }

  // Handle form submission
  function handleSubmit(event: Event) {
    event.preventDefault();
    
    try {
      // In a real app, this would be an API call
      if (user) {
        // Create a new user object with updated values
        const updatedUser: User = {
          ...user,
          name: formData.name || user.name || null,
          email: formData.email || user.email || null,
          bio: formData.bio || null,
          location: formData.location || null,
          timezone: formData.timezone || defaultTimezone,
          marketingEmails: formData.marketingEmails ?? false
        };
        
        user = updatedUser;
      } else {
        // Create a new user if none exists (shouldn't happen in normal flow)
        user = { 
          name: formData.name || null,
          email: formData.email || null,
          bio: formData.bio || null,
          location: formData.location || null,
          timezone: formData.timezone || defaultTimezone,
          marketingEmails: formData.marketingEmails ?? false
        };
      }
      
      console.log('Profile updated:', formData);
      isEditing = false;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  }

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

        <form onsubmit={handleSubmit} class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              disabled={!isEditing}
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              disabled
              class="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div class="space-y-2">
            <label for="bio" class="block text-sm font-medium">Bio</label>
            <textarea
              id="bio"
              bind:value={formData.bio}
              disabled={!isEditing}
              class="w-full p-2 border rounded min-h-[100px]"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <div class="space-y-2">
            <label for="location" class="block text-sm font-medium">Location</label>
            <input
              id="location"
              type="text"
              bind:value={formData.location}
              disabled={!isEditing}
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="space-y-2">
            <label for="timezone" class="block text-sm font-medium">Timezone</label>
            <select
              id="timezone"
              bind:value={formData.timezone}
              disabled={!isEditing}
              class="w-full p-2 border rounded"
            >
              <option value={defaultTimezone}>
                {defaultTimezone}
              </option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>

          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            {#if isEditing}
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
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
