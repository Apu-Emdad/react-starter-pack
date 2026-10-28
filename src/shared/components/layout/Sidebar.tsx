import {
  ActionIcon,
  Group,
  Menu,
  NavLink,
  Stack,
  Tooltip,
} from '@mantine/core';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAppSelector } from '@/app/store/hooks';
import { NAV_ITEMS, type NavItem } from '@/shared/constants/navItems';
import type { RoleName } from '@/shared/constants/roles';
import { Logo } from '../ui/Logo';
import classes from './Sidebar.module.css';

interface Props {
  expanded: boolean;
  onToggleExpanded: () => void;
}

/** Collapsed, it shows only the icons. Parents then open their children in a flyout menu. */
export const Sidebar = ({ expanded, onToggleExpanded }: Props) => {
  const role = useAppSelector((state) => state.auth.user?.role);
  const items = filterByRole(NAV_ITEMS, role);

  return (
    <Stack gap={0}>
      <Group
        h={56}
        px="md"
        justify={expanded ? 'space-between' : 'center'}
        wrap="nowrap"
      >
        {expanded && <Logo />}
        <Tooltip
          label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          position="right"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="md"
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={onToggleExpanded}
            visibleFrom="sm"
          >
            {expanded ? (
              <IconLayoutSidebarLeftCollapse size={18} />
            ) : (
              <IconLayoutSidebarLeftExpand size={18} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>

      <Stack gap={4} p="md">
        {items.map((item) =>
          expanded ? (
            <TreeItem key={item.label} item={item} />
          ) : (
            <CollapsedItem key={item.label} item={item} />
          ),
        )}
      </Stack>
    </Stack>
  );
};

/**
 * One link in the expanded tree
 *
 * A parent starts open when it holds the current page. Clicking a parent with
 * a url goes there and opens it; clicking it again on its own page closes it.
 */
const TreeItem = ({ item }: { item: NavItem }) => {
  const { pathname } = useLocation();
  const branchActive = isActive(item, pathname);
  const [opened, setOpened] = useState<boolean>();
  const Icon = item.icon;

  if (!item.children?.length) {
    return (
      <NavLink
        component={Link}
        to={item.url ?? ''}
        label={item.label}
        leftSection={Icon && <Icon size={18} />}
        active={branchActive}
        className={classes.link}
      />
    );
  }

  const isOpen = opened ?? branchActive;
  const ownPage = !!item.url && pathname === item.url;
  const parentProps = {
    label: item.label,
    leftSection: Icon && <Icon size={18} />,
    active: ownPage,
    opened: isOpen,
    onChange: () => setOpened(item.url && !ownPage ? true : !isOpen),
    className: classes.link,
    children: item.children.map((child) => (
      <TreeItem key={child.label} item={child} />
    )),
  };

  return item.url ? (
    <NavLink component={Link} to={item.url} {...parentProps} />
  ) : (
    <NavLink component="button" {...parentProps} />
  );
};

/** One top-level icon in the collapsed sidebar. */
const CollapsedItem = ({ item }: { item: NavItem }) => {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const icon = Icon && <Icon size={18} />;
  const active = isActive(item, pathname);

  if (!item.children?.length) {
    return (
      <Tooltip label={item.label} position="right">
        <NavLink
          component={Link}
          to={item.url ?? ''}
          aria-label={item.label}
          leftSection={icon}
          active={active}
          className={classes.link}
        />
      </Tooltip>
    );
  }

  return (
    <Menu trigger="click-hover" position="right-start" offset={12}>
      <Menu.Target>
        <NavLink
          component="button"
          aria-label={item.label}
          leftSection={icon}
          active={active}
          className={classes.link}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {item.url ? (
          <Menu.Item component={Link} to={item.url} fw={500}>
            {item.label}
          </Menu.Item>
        ) : (
          <Menu.Label>{item.label}</Menu.Label>
        )}
        <FlyoutItems items={item.children} />
      </Menu.Dropdown>
    </Menu>
  );
};

/** Children in the flyout. A child with its own children opens a sub menu. */
const FlyoutItems = ({ items }: { items: NavItem[] }) => {
  return items.map((item) => {
    const Icon = item.icon;
    const icon = Icon && <Icon size={16} />;

    if (!item.children?.length) {
      return (
        <Menu.Item
          key={item.label}
          component={Link}
          to={item.url ?? ''}
          leftSection={icon}
        >
          {item.label}
        </Menu.Item>
      );
    }

    return (
      <Menu.Sub key={item.label}>
        <Menu.Sub.Target>
          <Menu.Sub.Item leftSection={icon}>{item.label}</Menu.Sub.Item>
        </Menu.Sub.Target>
        <Menu.Sub.Dropdown>
          {item.url && (
            <Menu.Item component={Link} to={item.url} fw={500}>
              {item.label}
            </Menu.Item>
          )}
          <FlyoutItems items={item.children} />
        </Menu.Sub.Dropdown>
      </Menu.Sub>
    );
  });
};

/** True when the item's url or any of its children's urls holds the current page. */
const isActive = (item: NavItem, pathname: string): boolean => {
  return (
    (!!item.url && pathname.startsWith(item.url)) ||
    !!item.children?.some((child) => isActive(child, pathname))
  );
};

/** Drops links the role can't see, and parents left with nothing to open. */
const filterByRole = (items: NavItem[], role?: RoleName): NavItem[] => {
  return items
    .filter((item) => !item.roles || (!!role && item.roles.includes(role)))
    .map((item) =>
      item.children
        ? { ...item, children: filterByRole(item.children, role) }
        : item,
    )
    .filter((item) => item.url || item.children?.length);
};
