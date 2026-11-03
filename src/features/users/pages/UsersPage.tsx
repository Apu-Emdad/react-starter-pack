import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconUserOff } from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import { ROLE } from '@/shared/constants/roles';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';
import { EMPTY_FILTERS, UsersFilters } from '../components/UsersFilters';
import { usersApi } from '../api/usersApi';
import type { User, UsersFiltersState } from '../types';

export const UsersPage = () => {
  const currentUid = useAppSelector((state) => state.auth.user?.uid);
  const [filters, setFilters] = useState<UsersFiltersState>(EMPTY_FILTERS);

  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getUsers(filters),
    placeholderData: keepPreviousData,
  });

  const deactivateUser = useMutation({
    mutationFn: usersApi.deactivateUser,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      refetch();
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });
  const deleteUser = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      refetch();
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const { users = [], total = 0 } = data ?? {};

  const handleDeactivate = (user: User) =>
    modals.openConfirmModal({
      title: `Deactivate ${user.userName}?`,
      children: (
        <Text size="sm" c="dimmed">
          The user can't log in until they are activated again, and their
          sessions end now.
        </Text>
      ),
      labels: { confirm: 'Deactivate user', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deactivateUser.mutate(user.uid),
    });

  const handleDelete = (user: User) =>
    modals.openConfirmModal({
      title: `Delete ${user.userName}?`,
      children: (
        <Text size="sm" c="dimmed">
          This removes the user and ends their sessions. You can't undo this.
        </Text>
      ),
      labels: { confirm: 'Delete user', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser.mutate(user.uid),
    });

  return (
    <Stack gap="md">
      <PageTop title="Users" description={`${total} people can sign in.`} />

      <UsersFilters filters={filters} setFilters={setFilters} />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({
            currentUid,
            onDeactivate: handleDeactivate,
            onDelete: handleDelete,
          })}
          rows={users}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle="No users found"
          emptyDescription="Try a different search or clear the filters."
          pagination={{
            page: filters.page,
            pageSize: filters.pageSize,
            total,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      </Card>
    </Stack>
  );
};

interface TableHeadersDeps {
  currentUid: string | undefined;
  onDeactivate: (user: User) => void;
  onDelete: (user: User) => void;
}

const getTableHeaders = ({
  currentUid,
  onDeactivate,
  onDelete,
}: TableHeadersDeps): TableHeader<User>[] => {
  return [
    {
      label: 'User',
      render: (user) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            size={32}
            color="white"
            style={{ background: getAvatarGradient(user.userName) }}
          >
            {getInitials(user.userName)}
          </Avatar>
          <div>
            <Text size="sm" fw={500}>
              {user.userName}
            </Text>
            <Text size="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      label: 'Role',
      render: (user) => (
        <Badge
          variant={
            user.roleInfo.name === ROLE.SUPER_ADMIN ? 'light' : 'outline'
          }
          color={user.roleInfo.name === ROLE.SUPER_ADMIN ? 'brand' : 'gray'}
        >
          {user.roleInfo.name}
        </Badge>
      ),
    },
    {
      label: 'Status',
      render: (user) => (
        <Badge variant="light" color={user.isActive ? 'green' : 'yellow'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      label: 'Created',
      render: (user) => (
        <Text size="sm" c="dimmed">
          {formatDate(user.createdAt)}
        </Text>
      ),
    },
    {
      label: '',
      render: (user) =>
        user.uid === currentUid ? null : (
          <Group gap={4} justify="flex-end" wrap="nowrap">
            {user.isActive && (
              <Tooltip label="Deactivate">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label={`Deactivate ${user.userName}`}
                  onClick={() => onDeactivate(user)}
                >
                  <IconUserOff size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip label="Delete">
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={`Delete ${user.userName}`}
                onClick={() => onDelete(user)}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
    },
  ];
};
