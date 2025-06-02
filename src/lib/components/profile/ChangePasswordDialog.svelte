<script lang="ts">
  import { createForm, passwordChangeFormSchema } from '$lib/forms/superforms';
  import { FormField, FormSubmit } from '$lib/components/forms';
  import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import type { z } from 'zod';

  // Svelte 5 runes props
  let { open, onClose } = $props<{ open: boolean, onClose: () => void }>();
  let dialogOpen = $state(open);
  $effect(() => { dialogOpen = open; });

  // Define form data type
  type FormData = z.infer<typeof passwordChangeFormSchema>;

  // Create form with schema
  const { form, errors, enhance, submitting, reset } = createForm({
    schema: passwordChangeFormSchema,
    validationMode: 'submit',
    successMessage: 'Password changed successfully!',
    errorMessage: 'Failed to change password.',
    onSuccess: () => {
      toast.success('Password changed!');
      reset();
      dialogOpen = false;
      if (onClose) onClose();
    }
  });

  // Handle manual fetch POST for non-superforms fallback
  async function handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/app/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Password changed!');
        reset();
        dialogOpen = false;
        if (onClose) onClose();
      } else if (data.errors) {
        Object.entries(data.errors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(data.message || 'Failed to change password.');
      }
    } catch (err) {
      toast.error('Failed to change password.');
    }
  }

  const isLoading = $derived($submitting);

  function getError(field: keyof FormData): string {
    if (!$errors[field]) return '';
    return Array.isArray($errors[field]) ? $errors[field][0] || '' : '';
  }

  function handleClose() {
    open = false;
    if (onClose) onClose();
    reset();
  }
</script>

<Dialog bind:open={dialogOpen} on:close={handleClose}>
  <DialogContent>
    <DialogTitle>Change Password</DialogTitle>
    <DialogDescription>Enter your current password and choose a new password.</DialogDescription>
    <form method="POST" action="/app/profile/change-password" onsubmit={handleSubmit} class="space-y-4">
      <FormField
        name="currentPassword"
        label="Current Password"
        type="password"
        autocomplete="current-password"
        required
        bind:value={$form['currentPassword']}
        error={getError('currentPassword')}
      />
      <FormField
        name="newPassword"
        label="New Password"
        type="password"
        autocomplete="new-password"
        required
        bind:value={$form['newPassword']}
        error={getError('newPassword')}
      />
      <FormField
        name="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        autocomplete="new-password"
        required
        bind:value={$form['confirmNewPassword']}
        error={getError('confirmNewPassword')}
      />
      <DialogFooter>
        <FormSubmit label="Change Password" loading={isLoading} variant="primary" />
        <button
          type="button"
          class="ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          onclick={handleClose}
        >
          Cancel
        </button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

<style>
  /* Dialog and form styling handled by shadcn-svelte and Tailwind */
</style>
