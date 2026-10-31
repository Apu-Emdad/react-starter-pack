import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
  userNameSchema,
} from '@/features/auth/schemas/register.schema';

/** Same rules as the API's UpdateProfileDto and ChangePasswordDto. */
export const profileDetailsSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
});

export type ProfileDetailsValues = z.infer<typeof profileDetailsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required')
      .max(128, 'Current password must be at most 128 characters'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
