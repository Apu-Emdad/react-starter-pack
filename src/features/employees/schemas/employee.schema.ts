import { z } from 'zod';
import { registerSchema } from '@/features/auth/schemas/register.schema';
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../types';

/** Same rules as the API's EmployeeProfileDto. `department` only narrows the team list. */
export const employeeProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(60, 'Full name must be at most 60 characters'),
  bio: z.string().max(300, 'Bio must be at most 300 characters'),
  salary: z
    .number('Salary is required')
    .int('Salary must be a whole number')
    .min(0, 'Salary must be at least 0')
    .max(10_000_000, 'Salary must be at most 10,000,000'),
  department: z.enum(DEPARTMENTS, 'Department is required'),
  teamUid: z.string().min(1, 'Team is required'),
  skills: z.array(z.string()).max(10, 'Skills can have at most 10 items'),
  employmentType: z.enum(EMPLOYMENT_TYPES, 'Employment type is required'),
  joinDate: z.string('Join date is required').min(1, 'Join date is required'),
  isRemote: z.boolean(),
});

export const createEmployeeSchema = registerSchema.and(employeeProfileSchema);

/** Edit form uses the same values as the add form. The account fields stay empty and are not sent. */
export const editEmployeeSchema = employeeProfileSchema.extend({
  userName: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type EmployeeProfileValues = z.infer<typeof employeeProfileSchema>;
export type CreateEmployeeValues = z.infer<typeof createEmployeeSchema>;

export type EmployeeProfilePayload = Omit<EmployeeProfileValues, 'department'>;
export type CreateEmployeePayload = Omit<
  CreateEmployeeValues,
  'department' | 'confirmPassword'
>;
