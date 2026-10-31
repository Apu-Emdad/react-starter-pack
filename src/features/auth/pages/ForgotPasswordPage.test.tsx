import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { ForgotPasswordPage } from './ForgotPasswordPage';

const routes = [
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/login', element: <p>Login page</p> },
];

describe('ForgotPasswordPage', () => {
  it('checks the email before sending', async () => {
    renderRoutes(routes, { route: '/forgot-password' });

    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    await userEvent.click(
      screen.getByRole('button', { name: /send reset link/i }),
    );

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('sends the email, shows "Check your email" and can try again', async () => {
    let sentEmail = '';
    server.use(
      http.post(`${API}/auth/forgot-password`, async ({ request }) => {
        sentEmail = ((await request.json()) as { email: string }).email;
        return HttpResponse.json({ status: 200, message: 'Sent' });
      }),
    );
    renderRoutes(routes, { route: '/forgot-password' });

    await userEvent.type(screen.getByLabelText(/email/i), ' Maya@Mail.com ');
    await userEvent.click(
      screen.getByRole('button', { name: /send reset link/i }),
    );

    expect(await screen.findByText('Check your email')).toBeInTheDocument();
    expect(sentEmail).toBe('maya@mail.com');
    expect(screen.getByText(/maya@mail\.com/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(
      screen.getByRole('button', { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it('shows the API message when it fails', async () => {
    server.use(
      http.post(`${API}/auth/forgot-password`, () =>
        HttpResponse.json(
          {
            status: 429,
            message: 'Too many reset requests. Try again in 15 minutes.',
          },
          { status: 429 },
        ),
      ),
    );
    renderRoutes(routes, { route: '/forgot-password' });

    await userEvent.type(screen.getByLabelText(/email/i), 'maya@mail.com');
    await userEvent.click(
      screen.getByRole('button', { name: /send reset link/i }),
    );

    expect(
      await screen.findByText(
        'Too many reset requests. Try again in 15 minutes.',
      ),
    ).toBeInTheDocument();
  });

  it('links back to login', async () => {
    renderRoutes(routes, { route: '/forgot-password' });

    await userEvent.click(screen.getByRole('link', { name: /back to login/i }));
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
