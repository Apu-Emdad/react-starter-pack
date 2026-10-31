import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import {
  GuestOnly,
  RequireAuth,
  RequireRole,
} from '@/features/auth/guards/guards';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { EmployeeDetailsPage } from '@/features/employees/pages/EmployeeDetailsPage';
import { EmployeeFormPage } from '@/features/employees/pages/EmployeeFormPage';
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { ROLE } from '@/shared/constants/roles';
import { ROUTES } from '@/shared/constants/routes';
import { NotFoundPage } from './NotFoundPage';

/** Exported so tests can render the same routes in a memory router. */
export const routes: RouteObject[] = [
  { path: ROUTES.root, element: <Navigate to={ROUTES.dashboard} replace /> },
  {
    element: <GuestOnly />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
    ],
  },
  // Opened from email links, so they work logged in or out.
  { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
  { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
  { path: ROUTES.verifyEmail, element: <VerifyEmailPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.dashboard, element: <DashboardPage /> },
          { path: ROUTES.profile, element: <ProfilePage /> },
          {
            element: <RequireRole role={ROLE.SUPER_ADMIN} />,
            children: [
              { path: ROUTES.users, element: <UsersPage /> },
              { path: ROUTES.employees, element: <EmployeesPage /> },
              { path: ROUTES.employeeNew, element: <EmployeeFormPage /> },
              {
                path: ROUTES.employeeDetails,
                element: <EmployeeDetailsPage />,
              },
              { path: ROUTES.employeeEdit, element: <EmployeeFormPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
