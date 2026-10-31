import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconChartBar, IconSettings } from '@tabler/icons-react';
import { describe, expect, it, vi } from 'vitest';
import { ROLE, type RoleName } from '@/shared/constants/roles';
import { renderRoutes } from '@/test/utils';
import { Sidebar } from './Sidebar';

vi.mock('@/shared/constants/navItems', () => ({
  NAV_ITEMS: [
    {
      label: 'Reports',
      url: '/reports',
      icon: IconChartBar,
      children: [
        {
          label: 'Sales',
          children: [
            { label: 'Daily', url: '/reports/sales/daily' },
            { label: 'Monthly', url: '/reports/sales/monthly' },
          ],
        },
      ],
    },
    {
      label: 'Settings',
      icon: IconSettings,
      children: [
        { label: 'Profile', url: '/settings/profile' },
        {
          label: 'Billing',
          url: '/settings/billing',
          roles: ['SUPER_ADMIN'],
        },
      ],
    },
    {
      label: 'Admin',
      icon: IconSettings,
      children: [
        { label: 'Audit', url: '/admin/audit', roles: ['SUPER_ADMIN'] },
      ],
    },
  ],
}));

const renderSidebar = ({
  route = '/',
  expanded = true,
  role = ROLE.USER as RoleName,
} = {}) =>
  renderRoutes(
    [
      {
        path: '*',
        element: (
          <Sidebar
            expanded={expanded}
            onToggleExpanded={() => {}}
            onClose={() => {}}
          />
        ),
      },
    ],
    {
      route,
      preloadedState: {
        auth: {
          user: {
            uid: 'user000001',
            userName: 'maya',
            email: 'm@x.com',
            role,
            emailVerified: true,
            createdAt: '2026-10-01T00:00:00.000Z',
          },
          accessToken: 'token',
          status: 'authenticated' as const,
        },
      },
    },
  );

describe('Sidebar', () => {
  it('opens the branch that holds the current page, down to level 3', () => {
    renderSidebar({ route: '/reports/sales/daily' });

    const daily = screen.getByRole('link', { name: 'Daily' });
    expect(daily).toHaveAttribute('data-active');
    expect(screen.getByRole('link', { name: 'Monthly' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Profile' })).toBeNull();
  });

  it('opens a parent without a url on click', async () => {
    renderSidebar();

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));

    expect(
      await screen.findByRole('link', { name: 'Profile' }),
    ).toBeInTheDocument();
  });

  it('hides links the role cannot see, and parents left empty', async () => {
    renderSidebar();

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    await screen.findByRole('link', { name: 'Profile' });

    expect(screen.queryByText('Billing')).toBeNull();
    expect(screen.queryByText('Admin')).toBeNull();
  });

  it('shows the children in a flyout when collapsed', async () => {
    renderSidebar({ expanded: false, role: ROLE.SUPER_ADMIN });

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));

    expect(
      await screen.findByRole('menuitem', { name: 'Billing', hidden: true }),
    ).toBeInTheDocument();
  });
});
