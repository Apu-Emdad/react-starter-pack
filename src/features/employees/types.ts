export const DEPARTMENTS = ['ENGINEERING', 'DESIGN', 'SALES'] as const;
export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT'] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const DEPARTMENT_LABELS: Record<Department, string> = {
  ENGINEERING: 'Engineering',
  DESIGN: 'Design',
  SALES: 'Sales',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Full time',
  PART_TIME: 'Part time',
  CONTRACT: 'Contract',
};

/** Same lists as the API seed. The API accepts any skill, these are only suggestions. */
export const SKILL_OPTIONS = [
  {
    group: 'Engineering',
    items: ['React', 'Node', 'TypeScript', 'SQL', 'Docker'],
  },
  {
    group: 'Design',
    items: ['Figma', 'Branding', 'UX research', 'Illustration'],
  },
  {
    group: 'Sales',
    items: ['Negotiation', 'CRM', 'Outreach', 'Presentations'],
  },
];

export interface Team {
  uid: string;
  name: string;
  department: Department;
}

export interface Employee {
  uid: string;
  fullName: string;
  bio: string | null;
  salary: number;
  skills: string[];
  employmentType: EmploymentType;
  joinDate: string;
  isRemote: boolean;
  createdAt: string;
  userInfo: { uid: string; userName: string; email: string };
  teamInfo: Team;
}

export interface EmployeesList {
  employees: Employee[];
  total: number;
}

/** Everything the list page filters by. */
export interface EmployeesFiltersState {
  search: string;
  department: string;
  employmentType: string;
  isRemote: string;
  page: number;
  pageSize: number;
}
