import { screen } from '@testing-library/react';
import type { RouteObject } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { AuthUser } from '@/shared/api/types';
import { ROLE } from '@/shared/constants/roles';
import { renderRoutes } from '@/test/utils';
import { GuestOnly, RequireAuth, RequireRole } from './guards';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <GuestOnly />,
    children: [{ index: true, element: <p>Login page</p> }],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: '/dashboard', element: <p>Dashboard page</p> },
      {
        element: <RequireRole role={ROLE.SUPER_ADMIN} />,
        children: [{ path: '/users', element: <p>Users page</p> }],
      },
    ],
  },
];

const admin: AuthUser = {
  uid: 'admin00001',
  userName: 'apu',
  email: 'apu@mail.com',
  role: ROLE.SUPER_ADMIN,
};
const user = { ...admin, uid: 'user000001', role: ROLE.USER };
const session = (u: AuthUser) => ({
  auth: { user: u, accessToken: 'token', status: 'authenticated' as const },
});
const guest = {
  auth: { user: null, accessToken: null, status: 'guest' as const },
};

describe('route guards', () => {
  it('sends a guest to the login page', () => {
    renderRoutes(routes, { route: '/dashboard', preloadedState: guest });
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('lets a logged-in user see protected pages', () => {
    renderRoutes(routes, {
      route: '/dashboard',
      preloadedState: session(user),
    });
    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });

  it('sends a logged-in user away from the login page', () => {
    renderRoutes(routes, { route: '/login', preloadedState: session(user) });
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('hides admin pages from other roles', () => {
    renderRoutes(routes, { route: '/users', preloadedState: session(user) });
    expect(screen.queryByText('Users page')).not.toBeInTheDocument();
  });

  it('shows admin pages to a super admin', () => {
    renderRoutes(routes, { route: '/users', preloadedState: session(admin) });
    expect(screen.getByText('Users page')).toBeInTheDocument();
  });
});
