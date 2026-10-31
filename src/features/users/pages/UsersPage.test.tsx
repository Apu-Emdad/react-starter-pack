import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { ROLE } from '@/shared/constants/roles';
import { API } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { UsersPage } from './UsersPage';

const admin = {
  uid: 'admin00001',
  userName: 'apu_emdad',
  email: 'apu@mail.com',
  role: ROLE.SUPER_ADMIN,
  emailVerified: true,
  createdAt: '2026-10-01T00:00:00.000Z',
};
const state = {
  auth: { user: admin, accessToken: 'token', status: 'authenticated' as const },
};

const users = [
  {
    uid: 'admin00001',
    userName: 'apu_emdad',
    email: 'apu@mail.com',
    isActive: true,
    createdAt: '2026-10-26T10:00:00Z',
    roleInfo: { uid: 'r1', name: 'SUPER_ADMIN' },
  },
  {
    uid: 'user000001',
    userName: 'maya_r',
    email: 'maya@mail.com',
    isActive: true,
    createdAt: '2026-10-24T10:00:00Z',
    roleInfo: { uid: 'r2', name: 'USER' },
  },
];

describe('UsersPage', () => {
  it('lists users and hides the actions for the current user', async () => {
    server.use(
      http.get(`${API}/users`, () =>
        HttpResponse.json({
          status: 200,
          message: 'ok',
          data: { users, total: 2 },
        }),
      ),
    );
    renderRoutes([{ path: '/users', element: <UsersPage /> }], {
      route: '/users',
      preloadedState: state,
    });

    expect(await screen.findByText('maya_r')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete maya_r' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Delete apu_emdad' }),
    ).not.toBeInTheDocument();
  });

  it('deletes a user after confirming', async () => {
    let deleted = '';
    server.use(
      http.get(`${API}/users`, () =>
        HttpResponse.json({
          status: 200,
          message: 'ok',
          data: { users, total: 2 },
        }),
      ),
      http.delete(`${API}/users/:uid`, ({ params }) => {
        deleted = String(params.uid);
        return HttpResponse.json({
          status: 200,
          message: 'User deleted successfully',
        });
      }),
    );
    renderRoutes([{ path: '/users', element: <UsersPage /> }], {
      route: '/users',
      preloadedState: state,
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete maya_r' }),
    );
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete user' }),
    );

    await screen.findByText('maya_r');
    expect(deleted).toBe('user000001');
  });

  it('shows an empty state when nothing matches', async () => {
    server.use(
      http.get(`${API}/users`, () =>
        HttpResponse.json({
          status: 200,
          message: 'ok',
          data: { users: [], total: 0 },
        }),
      ),
    );
    renderRoutes([{ path: '/users', element: <UsersPage /> }], {
      route: '/users',
      preloadedState: state,
    });

    expect(await screen.findByText('No users found')).toBeInTheDocument();
  });
});
