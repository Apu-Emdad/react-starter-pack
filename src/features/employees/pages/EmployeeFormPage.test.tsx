import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { ROLE } from '@/shared/constants/roles';
import { API } from '@/test/handlers';
import { server } from '@/test/server';
import { renderRoutes } from '@/test/utils';
import { EmployeeFormPage } from './EmployeeFormPage';

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

const teamsHandler = http.get(`${API}/teams`, ({ request }) => {
  const department = new URL(request.url).searchParams.get('department');
  const teams = [
    { uid: 'team000001', name: 'Frontend', department: 'ENGINEERING' },
    { uid: 'team000004', name: 'Brand', department: 'DESIGN' },
  ].filter((team) => team.department === department);
  return HttpResponse.json({ status: 200, message: 'ok', data: { teams } });
});

const employee = {
  uid: 'emp0000001',
  fullName: 'Maya Rodriguez',
  bio: null,
  salary: 4500,
  skills: ['React'],
  employmentType: 'FULL_TIME',
  joinDate: '2024-03-05T00:00:00.000Z',
  isRemote: false,
  createdAt: '2024-03-05T00:00:00.000Z',
  userInfo: {
    uid: 'user000001',
    userName: 'maya_rodriguez',
    email: 'maya@example.com',
  },
  teamInfo: { uid: 'team000001', name: 'Frontend', department: 'ENGINEERING' },
};

const renderPage = (route = '/employees/new') =>
  renderRoutes(
    [
      { path: '/employees/new', element: <EmployeeFormPage /> },
      { path: '/employees/:uid/edit', element: <EmployeeFormPage /> },
      { path: '/employees/:uid', element: <p>Details page</p> },
    ],
    { route, preloadedState: state },
  );

const pick = async (label: RegExp, option: string) => {
  await userEvent.click(screen.getByRole('combobox', { name: label }));
  await userEvent.click(
    await screen.findByRole('option', { name: option, hidden: true }),
  );
};

describe('EmployeeFormPage', () => {
  it('shows the validation messages', async () => {
    server.use(teamsHandler);
    renderPage();

    await userEvent.click(
      screen.getByRole('button', { name: 'Save employee' }),
    );

    expect(
      await screen.findByText('Department is required'),
    ).toBeInTheDocument();
    expect(screen.getByText('Team is required')).toBeInTheDocument();
    expect(screen.getByText('Salary is required')).toBeInTheDocument();
  });

  it('only lists the teams of the picked department', async () => {
    server.use(teamsHandler);
    renderPage();

    await pick(/^department/i, 'Design');
    await userEvent.click(screen.getByRole('combobox', { name: /^team/i }));

    expect(
      await screen.findByRole('option', { name: 'Brand', hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Frontend', hidden: true }),
    ).not.toBeInTheDocument();
  });

  it('sends the payload without department and confirmPassword', async () => {
    let body: Record<string, unknown> = {};
    server.use(
      teamsHandler,
      http.post(`${API}/employees`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(
          {
            status: 201,
            message: 'Employee created successfully',
            data: { uid: 'emp0000009' },
          },
          { status: 201 },
        );
      }),
    );
    renderPage();

    await userEvent.type(
      screen.getByRole('textbox', { name: /user name/i }),
      'maya_rodriguez',
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: /email/i }),
      'maya@example.com',
    );
    await userEvent.type(screen.getByLabelText(/^password/i), '12345678');
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      '12345678',
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: /full name/i }),
      'Maya Rodriguez',
    );
    await pick(/^department/i, 'Engineering');
    await pick(/^team/i, 'Frontend');
    await userEvent.type(
      screen.getByRole('textbox', { name: /monthly salary/i }),
      '4500',
    );
    await userEvent.click(screen.getByRole('textbox', { name: /join date/i }));
    await userEvent.click(
      (await screen.findAllByRole('button', { name: /^1 /, hidden: true }))[0],
    );
    await userEvent.click(
      screen.getByRole('switch', { name: 'Works remotely' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save employee' }),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Confirm' }),
    );

    expect(await screen.findByText('Details page')).toBeInTheDocument();
    expect(body).toMatchObject({
      userName: 'maya_rodriguez',
      email: 'maya@example.com',
      fullName: 'Maya Rodriguez',
      teamUid: 'team000001',
      salary: 4500,
      employmentType: 'FULL_TIME',
      isRemote: true,
    });
    expect(body.joinDate).toMatch(/^\d{4}-\d{2}-01$/);
    expect(body).not.toHaveProperty('department');
    expect(body).not.toHaveProperty('confirmPassword');
  });

  it('edits the profile without sending the account fields', async () => {
    let body: Record<string, unknown> = {};
    server.use(
      teamsHandler,
      http.get(`${API}/employees/emp0000001`, () =>
        HttpResponse.json({ status: 200, message: 'ok', data: employee }),
      ),
      http.put(`${API}/employees/emp0000001`, async ({ request }) => {
        body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          status: 200,
          message: 'Employee updated successfully',
          data: employee,
        });
      }),
    );
    renderPage('/employees/emp0000001/edit');

    const fullName = await screen.findByRole('textbox', { name: /full name/i });
    expect(fullName).toHaveValue('Maya Rodriguez');
    expect(
      screen.queryByRole('textbox', { name: /user name/i }),
    ).not.toBeInTheDocument();

    await userEvent.clear(fullName);
    await userEvent.type(fullName, 'Maya R');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Confirm' }),
    );

    expect(await screen.findByText('Details page')).toBeInTheDocument();
    expect(body).toMatchObject({
      fullName: 'Maya R',
      teamUid: 'team000001',
      joinDate: '2024-03-05',
    });
    for (const key of [
      'userName',
      'email',
      'password',
      'confirmPassword',
      'department',
    ]) {
      expect(body).not.toHaveProperty(key);
    }
  });
});
