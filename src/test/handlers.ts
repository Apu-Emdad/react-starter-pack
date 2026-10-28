import { http, HttpResponse } from 'msw';

export const API = 'http://localhost:3000';

export const testUser = {
  uid: 'user000001',
  userName: 'maya_r',
  email: 'maya@mail.com',
  role: 'USER',
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
];
