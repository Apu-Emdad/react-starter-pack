import {
  IconId,
  IconLayoutDashboard,
  IconSitemap,
  IconUsers,
  type Icon,
} from '@tabler/icons-react';
import { ROLE, type RoleName } from './roles';
import { ROUTES } from './routes';

/** A parent may have no url; a leaf must have one. */
export interface NavItem {
  label: string;
  url?: string;
  /** Top-level items need one, since the collapsed sidebar shows only icons. */
  icon?: Icon;
  /** Roles that see the link. Left out means everyone. */
  roles?: RoleName[];
  children?: NavItem[];
}

/**
 * Sidebar links
 *
 * Nested to any depth through `children`.
 * Hiding a link only hides the UI: the API guards the route.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', url: ROUTES.dashboard, icon: IconLayoutDashboard },
  {
    label: 'Users',
    url: ROUTES.users,
    icon: IconUsers,
    roles: [ROLE.SUPER_ADMIN],
  },
  {
    label: 'Employees',
    url: ROUTES.employees,
    icon: IconId,
    roles: [ROLE.SUPER_ADMIN],
  },
  // Dummy nested menu to show the tree. Its pages don't exist yet, so they open the 404 page.
  {
    label: 'Demo menu',
    icon: IconSitemap,
    children: [
      { label: 'Overview', url: '/demo/overview' },
      {
        label: 'Reports',
        url: '/demo/reports',
        children: [
          { label: 'Daily', url: '/demo/reports/daily' },
          { label: 'Monthly', url: '/demo/reports/monthly' },
        ],
      },
      {
        label: 'Settings',
        children: [
          { label: 'Profile', url: '/demo/settings/profile' },
          { label: 'Billing', url: '/demo/settings/billing' },
        ],
      },
    ],
  },
];
