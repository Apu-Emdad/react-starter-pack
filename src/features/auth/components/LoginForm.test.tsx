import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, testUser } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { LoginForm } from './LoginForm';

const routes = [
  { path: '/login', element: <LoginForm /> },
  { path: '/dashboard', element: <p>Dashboard page</p> },
  { path: '/forgot-password', element: <p>Forgot password page</p> },
];

describe('LoginForm', () => {
  it('shows required errors when submitted empty', async () => {
    renderRoutes(routes, { route: '/login' });
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(
      await screen.findByText('User name or email is required'),
    ).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('links to forgot password next to the password label', async () => {
    renderRoutes(routes, { route: '/login' });

    await userEvent.click(
      screen.getByRole('link', { name: /forgot password/i }),
    );
    expect(await screen.findByText('Forgot password page')).toBeInTheDocument();
  });

  it('logs in, stores the session and goes to the dashboard', async () => {
    const { store } = renderRoutes(routes, { route: '/login' });

    await userEvent.type(
      screen.getByLabelText(/user name or email/i),
      'maya_r',
    );
    await userEvent.type(screen.getByLabelText(/^password/i), 'correct-horse');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();
    expect(store.getState().auth).toMatchObject({
      user: testUser,
      accessToken: 'token',
      status: 'authenticated',
    });
  });

  it('shows the API message when the login fails', async () => {
    server.use(
      http.post(`${API}/auth/login`, () =>
        HttpResponse.json(
          { status: 401, message: 'Invalid credentials' },
          { status: 401 },
        ),
      ),
    );
    const { store } = renderRoutes(routes, { route: '/login' });

    await userEvent.type(
      screen.getByLabelText(/user name or email/i),
      'maya_r',
    );
    await userEvent.type(screen.getByLabelText(/^password/i), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(store.getState().auth.accessToken).toBeNull();
  });
});
