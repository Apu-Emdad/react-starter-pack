import { z } from 'zod';

/** Same rules as the API's RegisterDto. Also used by the profile and reset password forms. */
export const userNameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9_-]{3,30}$/,
    'User name must be 3 to 30 characters: a-z, 0-9, _ or -',
  );

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email must be at most 254 characters')
  .pipe(z.email('Enter a valid email'));

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

export const registerSchema = z
  .object({
    userName: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
