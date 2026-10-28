import { axios } from '@/shared/api/interceptor';
import type { AuthPayload, AuthUser, Result } from '@/shared/api/types';
import type { LoginValues } from '../schemas/login.schema';
import type { RegisterValues } from '../schemas/register.schema';

/** Wrong credentials return 401, which must not start a token refresh. */
const noRefresh = { skipAuthRefresh: true };

export const authApi = {
  login: async (values: LoginValues) =>
    (await axios.post<Result<AuthPayload>>('/auth/login', values, noRefresh))
      .data.data,

  register: async (values: Omit<RegisterValues, 'confirmPassword'>) =>
    (await axios.post<Result<AuthPayload>>('/auth/register', values, noRefresh))
      .data.data,

  logout: async () =>
    (await axios.post<Result>('/auth/logout', null, noRefresh)).data,

  me: async () => (await axios.get<Result<AuthUser>>('/auth/me')).data.data,
};
