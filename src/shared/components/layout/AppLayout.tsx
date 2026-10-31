import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  const [navOpened, { toggle, close }] = useDisclosure();
  const [expanded, { toggle: toggleExpanded }] = useDisclosure(true);

  return (
    <AppShell
      layout="alt"
      header={{ height: 56 }}
      navbar={{
        width: expanded ? 220 : 72,
        breakpoint: 'sm',
        collapsed: { mobile: !navOpened },
      }}
      padding="lg"
      withBorder={false}
      styles={{
        header: { background: 'var(--app-shell-bg)' },
        navbar: { background: 'var(--app-shell-bg)' },
      }}
    >
      <AppShell.Header>
        <Header navOpened={navOpened} onToggleNav={toggle} />
      </AppShell.Header>
      {/* On phones, close the drawer after a link is picked, not when a parent opens. */}
      <AppShell.Navbar
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) close();
        }}
      >
        <Sidebar
          expanded={expanded}
          onToggleExpanded={toggleExpanded}
          onClose={close}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
