import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, testUser } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { VerifyEmailPage } from './VerifyEmailPage';

const TOKEN = 'b'.repeat(64);
const routes = [{ path: '/verify-email', element: <VerifyEmailPage /> }];

describe('VerifyEmailPage', () => {
  it('verifies once on load and updates the logged-in user', async () => {
    let calls = 0;
    server.use(
      http.post(`${API}/auth/verify-email`, () => {
        calls++;
        return HttpResponse.json({ status: 200, message: 'Email verified' });
      }),
    );
    const { store } = renderRoutes(routes, {
      route: `/verify-email?token=${TOKEN}`,
      preloadedState: {
        auth: {
          user: { ...testUser, emailVerified: false },
          accessToken: 'token',
          status: 'authenticated',
        },
      },
    });

    expect(await screen.findByText('Email verified')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to dashboard/i }),
    ).toBeInTheDocument();
    expect(calls).toBe(1);
    expect(store.getState().auth.user?.emailVerified).toBe(true);
  });

  it('shows the invalid state and a login button when logged out', async () => {
    server.use(
      http.post(`${API}/auth/verify-email`, () =>
        HttpResponse.json(
          {
            status: 400,
            message: 'This verification link is invalid or has expired',
          },
          { status: 400 },
        ),
      ),
    );
    renderRoutes(routes, { route: `/verify-email?token=${TOKEN}` });

    expect(
      await screen.findByText("This link doesn't work"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to login/i }),
    ).toBeInTheDocument();
  });
});
