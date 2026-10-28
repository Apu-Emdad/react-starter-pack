import { Button, Checkbox, Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useState } from 'react';
import { type DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { generatePath, Link, useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ROUTES } from '@/shared/constants/routes';
import { EmployeeFormFields } from '../components/EmployeeFormFields';
import { employeesApi } from '../api/employeesApi';
import {
  createEmployeeSchema,
  editEmployeeSchema,
  type CreateEmployeePayload,
  type CreateEmployeeValues,
} from '../schemas/employee.schema';
import type { Employee } from '../types';

/** Salary and department start empty, so they are left out. */
const DEFAULT_VALUES: DefaultValues<CreateEmployeeValues> = {
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  bio: '',
  teamUid: '',
  skills: [],
  employmentType: 'FULL_TIME',
  joinDate: '',
  isRemote: false,
};

/** Add page at `/employees/new`, edit page at `/employees/:uid/edit`. */
export const EmployeeFormPage = () => {
  const { uid = '' } = useParams();
  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['employees', uid],
    queryFn: () => employeesApi.getEmployee(uid),
    enabled: !!uid,
  });

  if (!uid) return <EmployeeForm />;
  if (isPending) return <PageLoader />;
  if (error) {
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  }

  return <EmployeeForm employee={data} />;
};

/**
 * Add or edit form
 *
 * With an employee it edits their profile. Without one it also creates
 * their login, so the account fields and "Add another" are shown.
 * Rendered after the employee loads, so the form starts with their values.
 */
const EmployeeForm = ({ employee }: { employee?: Employee }) => {
  const navigate = useNavigate();
  const [addAnother, setAddAnother] = useState(false);
  const isEdit = !!employee;
  const backPath = isEdit
    ? generatePath(ROUTES.employeeDetails, { uid: employee.uid })
    : ROUTES.employees;

  const form = useForm<CreateEmployeeValues>({
    resolver: isEdit
      ? zodResolver(editEmployeeSchema)
      : zodResolver(createEmployeeSchema),
    defaultValues: isEdit
      ? {
          ...DEFAULT_VALUES,
          fullName: employee.fullName,
          bio: employee.bio ?? '',
          salary: employee.salary,
          department: employee.teamInfo.department,
          teamUid: employee.teamInfo.uid,
          skills: employee.skills,
          employmentType: employee.employmentType,
          joinDate: dayjs(employee.joinDate).format('YYYY-MM-DD'),
          isRemote: employee.isRemote,
        }
      : DEFAULT_VALUES,
  });

  const saveEmployee = useMutation({
    mutationFn: ({
      userName,
      email,
      password,
      ...profile
    }: CreateEmployeePayload) =>
      isEdit
        ? employeesApi.updateEmployee({ uid: employee.uid, payload: profile })
        : employeesApi.createEmployee({
            userName,
            email,
            password,
            ...profile,
          }),
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      if (!isEdit && addAnother) {
        form.reset(DEFAULT_VALUES);
        return;
      }
      navigate(generatePath(ROUTES.employeeDetails, { uid: result.data.uid }));
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const onSubmit = ({
    confirmPassword: _confirm,
    department: _department,
    ...payload
  }: CreateEmployeeValues) =>
    modals.openConfirmModal({
      title: isEdit ? 'Save changes?' : 'Add this employee?',
      children: (
        <Text size="sm" c="dimmed">
          {isEdit
            ? `This updates ${employee.fullName}'s profile.`
            : `This creates ${payload.fullName} and their login.`}
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => saveEmployee.mutate(payload),
    });

  return (
    <Stack gap="md" maw={880}>
      <PageTop
        title={isEdit ? 'Edit employee' : 'Add employee'}
        description={
          isEdit
            ? `The login (${employee.userInfo.userName}) can't be changed here.`
            : 'This also creates their login with the USER role.'
        }
        backBtn
        fallbackPath={backPath}
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Stack gap="md">
            <EmployeeFormFields withAccount={!isEdit} />
            <Group justify={isEdit ? 'flex-end' : 'space-between'}>
              {!isEdit && (
                <Checkbox
                  label="Add another after saving"
                  checked={addAnother}
                  onChange={(event) =>
                    setAddAnother(event.currentTarget.checked)
                  }
                />
              )}
              <Group gap="sm">
                <Button component={Link} to={backPath} variant="default">
                  Cancel
                </Button>
                <Button type="submit" loading={saveEmployee.isPending}>
                  {isEdit ? 'Save changes' : 'Save employee'}
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  );
};
