import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { ResetPasswordPage } from './ResetPasswordPage';

const TOKEN = 'a'.repeat(64);
const routes = [
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/forgot-password', element: <p>Forgot password page</p> },
  { path: '/login', element: <p>Login page</p> },
];

const fillAndSubmit = async (password = 'brand-new-password') => {
  await userEvent.type(screen.getByLabelText(/^new password/i), password);
  await userEvent.type(
    screen.getByLabelText(/confirm new password/i),
    password,
  );
  await userEvent.click(
    screen.getByRole('button', { name: /reset password/i }),
  );
};

describe('ResetPasswordPage', () => {
  it('uses the same rules as register', async () => {
    renderRoutes(routes, { route: `/reset-password?token=${TOKEN}` });

    await userEvent.type(screen.getByLabelText(/^new password/i), 'short');
    await userEvent.type(
      screen.getByLabelText(/confirm new password/i),
      'other',
    );
    await userEvent.click(
      screen.getByRole('button', { name: /reset password/i }),
    );

    expect(
      await screen.findByText('Password must be at least 8 characters'),
    ).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('sends the token and the new password, then goes to login', async () => {
    let body: unknown;
    server.use(
      http.post(`${API}/auth/reset-password`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ status: 200, message: 'Password reset' });
      }),
    );
    renderRoutes(routes, { route: `/reset-password?token=${TOKEN}` });

    await fillAndSubmit();

    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(body).toEqual({ token: TOKEN, password: 'brand-new-password' });
  });

  it('shows the expired state when the API rejects the link', async () => {
    server.use(
      http.post(`${API}/auth/reset-password`, () =>
        HttpResponse.json(
          { status: 400, message: 'This reset link is invalid or has expired' },
          { status: 400 },
        ),
      ),
    );
    renderRoutes(routes, { route: `/reset-password?token=${TOKEN}` });

    await fillAndSubmit();

    expect(
      await screen.findByText("This link doesn't work"),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('link', { name: /send a new link/i }),
    );
    expect(await screen.findByText('Forgot password page')).toBeInTheDocument();
  });

  it('shows the expired state when the link has no token', () => {
    renderRoutes(routes, { route: '/reset-password' });

    expect(screen.getByText("This link doesn't work")).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /reset password/i }),
    ).not.toBeInTheDocument();
  });
});
