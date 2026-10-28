import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';

type CountFilter = 'true' | 'false' | '';

export const dashboardApi = {
  /** Asks for one user and reads `total`, so only the count travels. */
  countUsers: async (isActive: CountFilter) =>
    (
      await axios.get<Result<{ total: number }>>('/users', {
        params: { isActive, pageSize: 1 },
      })
    ).data.data.total,
};
