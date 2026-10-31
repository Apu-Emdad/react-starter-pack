import { z } from 'zod';
import { emailSchema } from './register.schema';

export const forgotPasswordSchema = z.object({ email: emailSchema });

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
