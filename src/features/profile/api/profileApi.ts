import { axios } from '@/shared/api/interceptor';
import type { AuthPayload, AuthUser, Result } from '@/shared/api/types';
import type { ProfileDetailsValues } from '../schemas/profile.schema';

export const profileApi = {
  updateProfile: async (params: ProfileDetailsValues) =>
    (await axios.patch<Result<AuthUser>>('/profile', params)).data,

  /** Ends every other session; returns a new token pair for this one. */
  changePassword: async (params: {
    currentPassword: string;
    newPassword: string;
  }) =>
    (await axios.patch<Result<AuthPayload>>('/profile/password', params)).data,
};
