import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { ROLE } from '@/shared/constants/roles';
import { API } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { EmployeesPage } from './EmployeesPage';

const state = {
  auth: {
    user: {
      uid: 'admin00001',
      userName: 'admin',
      email: 'admin@example.com',
      role: ROLE.SUPER_ADMIN,
      emailVerified: true,
      createdAt: '2026-10-01T00:00:00.000Z',
    },
    accessToken: 'token',
    status: 'authenticated' as const,
  },
};

const employees = [
  {
    uid: 'emp0000001',
    fullName: 'Maya Rodriguez',
    bio: null,
    salary: 4500,
    skills: ['React'],
    employmentType: 'FULL_TIME',
    joinDate: '2026-10-01T00:00:00.000Z',
    isRemote: true,
    createdAt: '2026-10-20T00:00:00.000Z',
    userInfo: {
      uid: 'user000001',
      userName: 'maya_rodriguez',
      email: 'maya.rodriguez@example.com',
    },
    teamInfo: {
      uid: 'team000001',
      name: 'Frontend',
      department: 'ENGINEERING',
    },
  },
];

const listHandler = (list = employees) =>
  http.get(`${API}/employees`, () =>
    HttpResponse.json({
      status: 200,
      message: 'ok',
      data: { employees: list, total: list.length },
    }),
  );

const renderPage = () =>
  renderRoutes([{ path: '/employees', element: <EmployeesPage /> }], {
    route: '/employees',
    preloadedState: state,
  });

describe('EmployeesPage', () => {
  it('lists employees with their team and labels', async () => {
    server.use(listHandler());
    renderPage();

    expect(await screen.findByText('Maya Rodriguez')).toBeInTheDocument();
    const table = within(screen.getByRole('table'));
    expect(table.getByText('Frontend')).toBeInTheDocument();
    expect(table.getByText('Engineering')).toBeInTheDocument();
    expect(table.getByText('Full time')).toBeInTheDocument();
    expect(table.getByText('Remote')).toBeInTheDocument();
  });

  it('deletes an employee after confirming', async () => {
    let deleted = '';
    server.use(
      listHandler(),
      http.delete(`${API}/employees/:uid`, ({ params }) => {
        deleted = String(params.uid);
        return HttpResponse.json({
          status: 200,
          message: 'Employee deleted successfully',
        });
      }),
    );
    renderPage();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete Maya Rodriguez' }),
    );
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete employee' }),
    );

    await screen.findByText('Maya Rodriguez');
    expect(deleted).toBe('emp0000001');
  });

  it('shows an empty state when nothing matches', async () => {
    server.use(listHandler([]));
    renderPage();

    expect(await screen.findByText('No employees found')).toBeInTheDocument();
  });
});
