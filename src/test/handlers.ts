import { http, HttpResponse } from 'msw';
import type { AuthUser } from '@/shared/api/types';

export const API = 'http://localhost:3000';

export const testUser: AuthUser = {
  uid: 'user000001',
  userName: 'maya_r',
  email: 'maya@mail.com',
  role: 'USER',
  emailVerified: true,
  createdAt: '2026-10-01T00:00:00.000Z',
};

/** Default fake API responses. A test can replace one with server.use(...). */
export const handlers = [
  http.post(`${API}/auth/login`, () =>
    HttpResponse.json({
      status: 200,
      message: 'Login successful',
      data: {
        accessToken: 'token',
        tokenType: 'Bearer',
        expiresIn: 900,
        user: testUser,
      },
    }),
  ),
  http.post(`${API}/auth/refresh`, () =>
    HttpResponse.json(
      { status: 401, message: 'Invalid refresh token' },
      { status: 401 },
    ),
  ),
  http.post(`${API}/auth/logout`, () =>
    HttpResponse.json({ status: 200, message: 'Logged out' }),
  ),
  http.post(`${API}/auth/forgot-password`, () =>
    HttpResponse.json({
      status: 200,
      message:
        'If an account with that email exists, we sent a link to reset the password',
    }),
  ),
  http.post(`${API}/auth/reset-password`, () =>
    HttpResponse.json({
      status: 200,
      message: 'Password reset successfully. Log in with your new password.',
    }),
  ),
  http.post(`${API}/auth/verify-email`, () =>
    HttpResponse.json({ status: 200, message: 'Email verified successfully' }),
  ),
  http.post(`${API}/auth/resend-verification`, () =>
    HttpResponse.json({ status: 200, message: 'Verification email sent' }),
  ),
];
