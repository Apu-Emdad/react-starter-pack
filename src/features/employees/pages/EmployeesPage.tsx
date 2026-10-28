import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEye, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  generatePath,
  Link,
  useNavigate,
  type NavigateFunction,
} from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import { ROUTES } from '@/shared/constants/routes';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';
import {
  EMPTY_FILTERS,
  EmployeesFilters,
} from '../components/EmployeesFilters';
import { employeesApi } from '../api/employeesApi';
import {
  DEPARTMENT_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  type Employee,
  type EmployeesFiltersState,
} from '../types';

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EmployeesFiltersState>(EMPTY_FILTERS);
  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeesApi.getEmployees(filters),
    placeholderData: keepPreviousData,
  });

  const deleteEmployee = useMutation({
    mutationFn: employeesApi.deleteEmployee,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      refetch();
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const { employees = [], total = 0 } = data ?? {};
  const totalPages = Math.ceil(total / filters.pageSize);

  const handleDelete = (employee: Employee) =>
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
    <Stack gap="md">
      <PageTop
        title="Employees"
        description={`${total} people across all teams.`}
        rightSection={
          <Button
            component={Link}
            to={ROUTES.employeeNew}
            leftSection={<IconPlus size={16} />}
          >
            Add employee
          </Button>
        }
      />

      <EmployeesFilters filters={filters} setFilters={setFilters} />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({ navigate, onDelete: handleDelete })}
          rows={employees}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle="No employees found"
          emptyDescription="Try a different search or clear the filters."
          minWidth={820}
        />
      </Card>

      {totalPages > 1 && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Page {filters.page} of {totalPages}
          </Text>
          <Pagination
            value={filters.page}
            total={totalPages}
            onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </Group>
      )}
    </Stack>
  );
};

interface TableHeadersDeps {
  navigate: NavigateFunction;
  onDelete: (employee: Employee) => void;
}

const getTableHeaders = ({
  navigate,
  onDelete,
}: TableHeadersDeps): TableHeader<Employee>[] => {
  return [
    {
      label: 'Employee',
      render: (employee) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            size={32}
            color="white"
            style={{
              background: getAvatarGradient(employee.userInfo.userName),
            }}
          >
            {getInitials(employee.fullName)}
          </Avatar>
          <div>
            <Text size="sm" fw={500}>
              {employee.fullName}
            </Text>
            <Text size="xs" c="dimmed">
              {employee.userInfo.email}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      label: 'Team',
      render: (employee) => (
        <div>
          <Text size="sm">{employee.teamInfo.name}</Text>
          <Text size="xs" c="dimmed">
            {DEPARTMENT_LABELS[employee.teamInfo.department]}
          </Text>
        </div>
      ),
    },
    {
      label: 'Type',
      render: (employee) => (
        <Badge variant="outline" color="gray">
          {EMPLOYMENT_TYPE_LABELS[employee.employmentType]}
        </Badge>
      ),
    },
    {
      label: 'Location',
      render: (employee) =>
        employee.isRemote ? (
          <Badge variant="light" color="teal">
            Remote
          </Badge>
        ) : (
          <Badge variant="light" color="gray">
            On site
          </Badge>
        ),
    },
    {
      label: 'Salary',
      render: (employee) => (
        <Text size="sm">{employee.salary.toLocaleString('en-US')}</Text>
      ),
    },
    {
      label: 'Joined',
      render: (employee) => (
        <Text size="sm" c="dimmed">
          {formatDate(employee.joinDate)}
        </Text>
      ),
    },
    {
      label: '',
      render: (employee) => (
        <Group gap={4} justify="flex-end" wrap="nowrap">
          <Tooltip label="View">
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`View ${employee.fullName}`}
              onClick={() =>
                navigate(
                  generatePath(ROUTES.employeeDetails, { uid: employee.uid }),
                )
              }
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`Edit ${employee.fullName}`}
              onClick={() =>
                navigate(
                  generatePath(ROUTES.employeeEdit, { uid: employee.uid }),
                )
              }
            >
              <IconPencil size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label={`Delete ${employee.fullName}`}
              onClick={() => onDelete(employee)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
};
