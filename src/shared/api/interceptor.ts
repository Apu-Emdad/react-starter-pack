import baseAxios, { AxiosError, isAxiosError } from 'axios';
import type { AuthPayload, Result } from './types';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Don't try to refresh the access token when this request gets a 401. */
    skipAuthRefresh?: boolean;
    _retried?: boolean;
  }
}

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

/** withCredentials sends the httpOnly refresh cookie to the API. */
export const axios = baseAxios.create({
  baseURL: API_URL,
  withCredentials: true,
});

interface Handlers {
  getToken: () => string | null;
  onSession: (payload: AuthPayload) => void;
  onLogout: () => void;
}

let handlers: Handlers = {
  getToken: () => null,
  onSession: () => {},
  onLogout: () => {},
};

/** Called once by the store, so this file doesn't import the store (no import cycle). */
export const configureInterceptor = (next: Handlers) => {
  handlers = next;
};

let refreshing: Promise<AuthPayload> | null = null;

/**
 * Gets a new access token with the refresh cookie.
 *
 * The API rotates the refresh token and revokes every session if an old one is reused.
 * So parallel callers (React StrictMode, several 401s at once) share one request.
 */
export const refreshSession = (): Promise<AuthPayload> => {
  refreshing ??= axios
    .post<Result<AuthPayload>>('/auth/refresh', null, { skipAuthRefresh: true })
    .then((res) => {
      handlers.onSession(res.data.data);
      return res.data.data;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};

axios.interceptors.request.use((config) => {
  const token = handlers.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config;
  if (
    error.response?.status !== 401 ||
    !config ||
    config.skipAuthRefresh ||
    config._retried
  ) {
    throw error;
  }

  config._retried = true;
  try {
    await refreshSession();
  } catch {
    handlers.onLogout();
    throw error;
  }
  return axios(config);
});

/** The API's `message` for a failed request, or a fallback. */
export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong',
): string => {
  if (isAxiosError<Result>(error)) {
    return error.response?.data?.message ?? 'Could not reach the server';
  }
  return fallback;
};
