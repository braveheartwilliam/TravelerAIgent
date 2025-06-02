/**
 * Superforms utilities
 * Provides consistent form handling with Zod validation
 */

import { z } from 'zod';
import { superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { toast } from 'svelte-sonner';
import type { SuperValidated } from 'sveltekit-superforms';

/**
 * Options for creating a form with Superforms
 */
export interface CreateFormOptions<T extends z.ZodTypeAny> {
  /** Zod schema for form validation */
  schema: T;
  /** Form data for initial values */
  data?: SuperValidated<T> | Record<string, unknown>;
  /** Custom success message */
  successMessage?: string;
  /** Custom error message */
  errorMessage?: string;
  /** Callback on successful form submission */
  onSuccess?: (data: z.infer<T>) => void | Promise<void>;
  /** Callback on form validation error */
  onError?: (errors: z.ZodError) => void | Promise<void>;
  /** Validation mode */
  validationMode?: 'auto' | 'submit' | 'change' | 'blur';
  /** Whether to reset the form after successful submission */
  resetAfterSubmit?: boolean;
  /** Whether to scroll to the first error on validation failure */
  scrollToError?: boolean;
  /** Whether to focus the first error field on validation failure */
  autoFocusOnError?: boolean;
  /** Whether to taint the form when user interacts with it */
  taintedMessage?: string | boolean;
}

/**
 * Create a form with Superforms and Zod validation
 * @param options Form options
 * @returns Superforms form instance
 */
export function createForm<T extends z.ZodTypeAny>(options: CreateFormOptions<T>) {
  const {
    schema,
    data,
    successMessage = 'Form submitted successfully',
    errorMessage = 'Please fix the errors in the form',
    onSuccess,
    onError,
    validationMode = 'auto',
    resetAfterSubmit = false,
    scrollToError = true,
    autoFocusOnError = true,
    taintedMessage = 'You have unsaved changes. Are you sure you want to leave?',
  } = options;

  // Ensure we have valid form data to prevent undefined values and infinite loops
  // This is critical for proper form initialization and preventing reactivity issues
  const safeData = data || { data: {} };
  
  return superForm(safeData as any, {
    id: crypto.randomUUID(), // Generate a unique ID for the form
    validators: zod(schema),
    validationMethod: validationMode as any, // Type assertion for compatibility
    resetForm: resetAfterSubmit,
    scrollToError,
    autoFocusOnError, // Use the renamed property
    taintedMessage,
    dataType: 'json', // Use JSON for data transfer
    onSubmit: ({ form }: any) => {
      // This runs before the form is submitted to the server
      console.log('Form submission started:', form?.data);
    },
    onResult: ({ result }: any) => {
      // This runs when the server responds
      if (result.type === 'success') {
        if (successMessage) {
          toast.success(successMessage);
        }
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else if (result.type === 'error') {
        if (errorMessage) {
          toast.error(errorMessage);
        }
        if (onError && result.error instanceof z.ZodError) {
          onError(result.error);
        }
      } else if (result.type === 'failure') {
        const message = typeof result.message === 'string' ? result.message : 'Form submission failed';
        toast.error(message);
      }
    },
    onUpdate: ({ form }: any) => {
      // This runs when the form is updated
      console.log('Form updated:', form);
    }
  });
}

/**
 * Common validation schemas
 */
export const validationSchemas = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  userName: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format'),
  url: z.string().url('Please enter a valid URL'),
};

/**
 * Create a login form schema
 */
export const loginFormSchema = z.object({
  email: validationSchemas.email,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

/**
 * Create a registration form schema
 */
export const registrationFormSchema = z.object({
  userName: validationSchemas.userName,
  email: validationSchemas.email,
  password: validationSchemas.password,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: validationSchemas.name,
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Create a profile form schema
 */
export const profileFormSchema = z.object({
  // Basic profile information
  name: z.string().min(1, 'Name is required'),
  email: validationSchemas.email,
  bio: z.string().optional().default('Travel enthusiast and adventure seeker'),
  location: z.string().optional().default('San Francisco, CA'),
  timezone: z.string().optional().default(Intl.DateTimeFormat().resolvedOptions().timeZone),
  marketingEmails: z.boolean().optional().default(false),
  
  // Additional profile fields (optional)
  userName: validationSchemas.userName.optional(),
  fullName: validationSchemas.name.optional(),
  phone: validationSchemas.phone.optional(),
  street: z.string().optional(),
  apt: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

/**
 * Create a password change form schema
 */
export const passwordChangeFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: validationSchemas.password,
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword'],
});
