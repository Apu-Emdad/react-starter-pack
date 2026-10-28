import { describe, expect, it } from 'vitest';
import reducer, { clearSession, setSession } from './authSlice';

const user = {
  uid: 'user000001',
  userName: 'maya_r',
  email: 'maya@mail.com',
  role: 'USER' as const,
};

describe('authSlice', () => {
  it('starts in the loading state with no user', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      user: null,
      accessToken: null,
      status: 'loading',
    });
  });

  it('setSession stores the user and token', () => {
    const state = reducer(
      undefined,
      setSession({ user, accessToken: 'token' }),
    );
    expect(state).toEqual({
      user,
      accessToken: 'token',
      status: 'authenticated',
    });
  });

  it('clearSession removes them and marks the user as a guest', () => {
    const loggedIn = reducer(
      undefined,
      setSession({ user, accessToken: 'token' }),
    );
    expect(reducer(loggedIn, clearSession())).toEqual({
      user: null,
      accessToken: null,
      status: 'guest',
    });
  });
});
