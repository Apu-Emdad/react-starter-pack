import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, testUser } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { ProfilePage } from './ProfilePage';

const routes = [{ path: '/profile', element: <ProfilePage /> }];
const preloadedState = {
  auth: {
    user: testUser,
    accessToken: 'token',
    status: 'authenticated' as const,
  },
};

describe('ProfilePage', () => {
  it('shows the user summary', () => {
    renderRoutes(routes, { route: '/profile', preloadedState });

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Joined 01 Oct 2026')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('saves the details and updates the logged-in user', async () => {
    let body: unknown;
    server.use(
      http.patch(`${API}/profile`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({
          status: 200,
          message: 'Profile updated. We sent a link to verify your new email.',
          data: {
            ...testUser,
            userName: 'maya_new',
            email: 'new@mail.com',
            emailVerified: false,
          },
        });
      }),
    );
    const { store } = renderRoutes(routes, {
      route: '/profile',
      preloadedState,
    });

    const userName = screen.getByLabelText(/user name/i);
    const email = screen.getByLabelText(/^email/i);
    await userEvent.clear(userName);
    await userEvent.type(userName, 'maya_new');
    await userEvent.clear(email);
    await userEvent.type(email, 'New@Mail.com');

    expect(
      screen.getByText(/you'll need to verify the new email/i),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /save changes/i }),
    );

    await expect
      .poll(() => store.getState().auth.user?.email)
      .toBe('new@mail.com');
    expect(body).toEqual({ userName: 'maya_new', email: 'new@mail.com' });
    expect(store.getState().auth.user).toMatchObject({
      userName: 'maya_new',
      emailVerified: false,
    });
    expect(await screen.findByText('Not verified')).toBeInTheDocument();
  });

  it('changes the password, keeps the new session and clears the form', async () => {
    server.use(
      http.patch(`${API}/profile/password`, () =>
        HttpResponse.json({
          status: 200,
          message: 'Password changed',
          data: {
            accessToken: 'new-token',
            tokenType: 'Bearer',
            expiresIn: 900,
            user: testUser,
          },
        }),
      ),
    );
    const { store } = renderRoutes(routes, {
      route: '/profile',
      preloadedState,
    });

    const current = screen.getByLabelText(/current password/i);
    await userEvent.type(current, 'old-password');
    await userEvent.type(
      screen.getByLabelText(/^new password/i),
      'brand-new-password',
    );
    await userEvent.type(
      screen.getByLabelText(/confirm new password/i),
      'brand-new-password',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /change password/i }),
    );

    await expect
      .poll(() => store.getState().auth.accessToken)
      .toBe('new-token');
    expect(current).toHaveValue('');
  });
});
