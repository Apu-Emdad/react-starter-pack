import { z } from 'zod';

export const loginSchema = z.object({
  userNameOrEmail: z
    .string()
    .trim()
    .min(1, 'User name or email is required')
    .max(254, 'User name or email must be at most 254 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password must be at most 128 characters'),
});

export type LoginValues = z.infer<typeof loginSchema>;
