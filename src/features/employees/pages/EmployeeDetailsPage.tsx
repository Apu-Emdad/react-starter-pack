import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { generatePath, Link, useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ROUTES } from '@/shared/constants/routes';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';
import { employeesApi } from '../api/employeesApi';
import { DEPARTMENT_LABELS, EMPLOYMENT_TYPE_LABELS } from '../types';

export const EmployeeDetailsPage = () => {
  const { uid = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const employeeQuery = useQuery({
    queryKey: ['employees', uid],
    queryFn: () => employeesApi.getEmployee(uid),
  });

  const deleteEmployee = useMutation({
    mutationFn: employeesApi.deleteEmployee,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate(ROUTES.employees);
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  if (employeeQuery.isPending) return <PageLoader />;

  if (employeeQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(employeeQuery.error)}
        onRetry={() => employeeQuery.refetch()}
      />
    );
  }

  const employee = employeeQuery.data;

  const handleDelete = () =>
    modals.openConfirmModal({
      title: `Delete ${employee.fullName}?`,
      children: (
        <Text size="sm" c="dimmed">
          This removes the employee and their login, and ends their sessions.
          You can't undo this.
        </Text>
      ),
      labels: { confirm: 'Delete employee', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteEmployee.mutate(employee.uid),
    });

  return (
    <Stack gap="md" maw={880}>
      <PageTop
        title="Employee details"
        backBtn
        fallbackPath={ROUTES.employees}
      />

      <Card withBorder padding="lg">
        <Group justify="space-between" align="flex-start">
          <Group gap="md" wrap="nowrap">
            <Avatar
              size={64}
              color="white"
              style={{
                background: getAvatarGradient(employee.userInfo.userName),
              }}
            >
              {getInitials(employee.fullName)}
            </Avatar>
            <div>
              <Title order={2} fz={22}>
                {employee.fullName}
              </Title>
              <Text c="dimmed" size="sm">
                {employee.userInfo.userName} · {employee.userInfo.email}
              </Text>
              <Group gap={6} mt={6}>
                <Badge variant="light">
                  {DEPARTMENT_LABELS[employee.teamInfo.department]}
                </Badge>
                <Badge variant="outline" color="gray">
                  {EMPLOYMENT_TYPE_LABELS[employee.employmentType]}
                </Badge>
                {employee.isRemote && (
                  <Badge variant="light" color="teal">
                    Remote
                  </Badge>
                )}
              </Group>
            </div>
          </Group>
          <Group gap="sm">
            <Button
              component={Link}
              to={generatePath(ROUTES.employeeEdit, { uid: employee.uid })}
              variant="default"
              leftSection={<IconPencil size={16} />}
            >
              Edit
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Group>
        </Group>
      </Card>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card withBorder padding="lg">
          <Stack gap="sm">
            <Text fw={600}>Job</Text>
            <Detail label="Team">{employee.teamInfo.name}</Detail>
            <Detail label="Monthly salary">
              {employee.salary.toLocaleString('en-US')}
            </Detail>
            <Detail label="Joined">{formatDate(employee.joinDate)}</Detail>
            <Detail label="Location">
              {employee.isRemote ? 'Remote' : 'On site'}
            </Detail>
          </Stack>
        </Card>
        <Card withBorder padding="lg">
          <Stack gap="sm">
            <Text fw={600}>About</Text>
            {employee.bio ? (
              <Text size="sm">{employee.bio}</Text>
            ) : (
              <Text size="sm" c="dimmed">
                No bio yet.
              </Text>
            )}
            <Group gap={6}>
              {employee.skills.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No skills added.
                </Text>
              ) : (
                employee.skills.map((skill) => (
                  <Badge key={skill} variant="default">
                    {skill}
                  </Badge>
                ))
              )}
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

const Detail = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <Group justify="space-between">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {children}
      </Text>
    </Group>
  );
};
