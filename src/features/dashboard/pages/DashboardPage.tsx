import { SimpleGrid, Stack } from '@mantine/core';
import { IconBolt, IconUserOff, IconUsers } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/store/hooks';
import { ROLE } from '@/shared/constants/roles';
import { SignupsChart } from '../components/SignupsChart';
import { StatCard } from '../components/StatCard';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { dashboardApi } from '../api/dashboardApi';

export const DashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === ROLE.SUPER_ADMIN;

  // Only super admins can read /users, so other roles don't run these queries.
  const totalQuery = useQuery({
    queryKey: ['stats', 'total'],
    queryFn: () => dashboardApi.countUsers(''),
    enabled: isAdmin,
  });
  const activeQuery = useQuery({
    queryKey: ['stats', 'active'],
    queryFn: () => dashboardApi.countUsers('true'),
    enabled: isAdmin,
  });
  const inactiveQuery = useQuery({
    queryKey: ['stats', 'inactive'],
    queryFn: () => dashboardApi.countUsers('false'),
    enabled: isAdmin,
  });

  return (
    <Stack gap="md">
      <WelcomeBanner name={user?.userName ?? ''} />
      {isAdmin && (
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <StatCard
            label="Total users"
            value={totalQuery.data}
            icon={<IconUsers size={16} />}
            color="brand"
          />
          <StatCard
            label="Active"
            value={activeQuery.data}
            icon={<IconBolt size={16} />}
            color="green"
          />
          <StatCard
            label="Inactive"
            value={inactiveQuery.data}
            icon={<IconUserOff size={16} />}
            color="yellow"
          />
        </SimpleGrid>
      )}
      <SignupsChart />
    </Stack>
  );
};
