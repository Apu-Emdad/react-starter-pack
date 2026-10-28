import type { RoleName } from '@/shared/constants/roles';

export interface User {
  uid: string;
  userName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roleInfo: { uid: string; name: RoleName };
}

export interface UsersList {
  users: User[];
  total: number;
}

/** Everything the list page filters by. */
export interface UsersFiltersState {
  search: string;
  role: string;
  isActive: string;
  page: number;
  pageSize: number;
}
