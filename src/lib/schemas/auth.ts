import { z } from 'zod';

// Define the signup schema with validation rules
export const signupSchema = z.object({
  // Using userName to match the database column name
  userName: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Type for the signup form data
export type SignupFormData = z.infer<typeof signupSchema>;
