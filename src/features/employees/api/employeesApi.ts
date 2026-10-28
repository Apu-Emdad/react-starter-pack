import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type {
  CreateEmployeePayload,
  EmployeeProfilePayload,
} from '../schemas/employee.schema';
import type {
  Employee,
  EmployeesFiltersState,
  EmployeesList,
  Team,
} from '../types';

export const employeesApi = {
  getEmployees: async (params: EmployeesFiltersState) =>
    (await axios.get<Result<EmployeesList>>('/employees', { params })).data
      .data,

  getEmployee: async (uid: string) =>
    (await axios.get<Result<Employee>>(`/employees/${uid}`)).data.data,

  createEmployee: async (payload: CreateEmployeePayload) =>
    (await axios.post<Result<Employee>>('/employees', payload)).data,

  updateEmployee: async ({
    uid,
    payload,
  }: {
    uid: string;
    payload: EmployeeProfilePayload;
  }) => (await axios.put<Result<Employee>>(`/employees/${uid}`, payload)).data,

  deleteEmployee: async (uid: string) =>
    (await axios.delete<Result>(`/employees/${uid}`)).data,

  getTeams: async (department: string) =>
    (
      await axios.get<Result<{ teams: Team[] }>>('/teams', {
        params: { department },
      })
    ).data.data.teams,
};
