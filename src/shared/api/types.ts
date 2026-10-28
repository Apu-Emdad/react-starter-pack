import type { RoleName } from '@/shared/constants/roles';

/** Shape of every API response, success or error. */
export interface Result<T = unknown> {
  status: number;
  message: string;
  data: T;
  error?: string;
  context?: string;
}

export interface AuthUser {
  uid: string;
  userName: string;
  email: string;
  role: RoleName;
}

/** What login, register and refresh return in `data`. */
export interface AuthPayload {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}
