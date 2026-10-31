import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import type { AuthUser } from '@/shared/api/types';
import { API, testUser } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { VerifyEmailBanner } from './VerifyEmailBanner';

const routes = [{ path: '/', element: <VerifyEmailBanner /> }];
const session = (user: AuthUser) => ({
  auth: { user, accessToken: 'token', status: 'authenticated' as const },
});

describe('VerifyEmailBanner', () => {
  afterEach(() => sessionStorage.clear());

  it('shows for an unverified user with their email', () => {
    renderRoutes(routes, {
      preloadedState: session({ ...testUser, emailVerified: false }),
    });

    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    expect(screen.getByText(testUser.email)).toBeInTheDocument();
  });

  it('is hidden for a verified user', () => {
    renderRoutes(routes, {
      preloadedState: session({ ...testUser, emailVerified: true }),
    });

    expect(screen.queryByText(/verify your email/i)).not.toBeInTheDocument();
  });

  it('resends the link', async () => {
    let calls = 0;
    server.use(
      http.post(`${API}/auth/resend-verification`, () => {
        calls++;
        return HttpResponse.json({ status: 200, message: 'Sent' });
      }),
    );
    renderRoutes(routes, {
      preloadedState: session({ ...testUser, emailVerified: false }),
    });

    await userEvent.click(screen.getByRole('button', { name: /resend link/i }));

    await expect.poll(() => calls).toBe(1);
  });

  it('dismissing hides it for this session', async () => {
    const view = renderRoutes(routes, {
      preloadedState: session({ ...testUser, emailVerified: false }),
    });

    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));

    expect(screen.queryByText(/verify your email/i)).not.toBeInTheDocument();
    view.unmount();
    renderRoutes(routes, {
      preloadedState: session({ ...testUser, emailVerified: false }),
    });
    expect(screen.queryByText(/verify your email/i)).not.toBeInTheDocument();
  });
});
