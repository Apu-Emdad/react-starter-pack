import {
  Button,
  Card,
  Checkbox,
  Group,
  Radio,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconAt,
  IconCalendar,
  IconLock,
  IconMail,
  IconUser,
} from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  type DefaultValues,
  FormProvider,
  useForm,
  useWatch,
} from 'react-hook-form';
import { generatePath, Link, useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  FormDateInput,
  FormMultiSelect,
  FormNumberInput,
  FormPasswordInput,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormTextarea,
  FormTextInput,
} from '@/shared/components/ui/FormFields';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ROUTES } from '@/shared/constants/routes';
import { employeesApi } from '../api/employeesApi';
import {
  createEmployeeSchema,
  editEmployeeSchema,
  type CreateEmployeePayload,
  type CreateEmployeeValues,
} from '../schemas/employee.schema';
import {
  DEPARTMENT_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  SKILL_OPTIONS,
  type Employee,
} from '../types';

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

const DEPARTMENT_OPTIONS = Object.entries(DEPARTMENT_LABELS).map(
  ([value, label]) => ({ value, label }),
);

/**
 * Add page at `/employees/new`, edit page at `/employees/:uid/edit`
 *
 * Adding also creates the employee's login, so the account fields and
 * "Add another" are shown only then. Editing can't change the login.
 */
export const EmployeeFormPage = () => {
  const { uid = '' } = useParams();
  const navigate = useNavigate();
  const [addAnother, setAddAnother] = useState(false);
  const [today] = useState(() => dayjs().format('YYYY-MM-DD'));
  const isEdit = !!uid;
  const backPath = isEdit
    ? generatePath(ROUTES.employeeDetails, { uid })
    : ROUTES.employees;

  const employeeQuery = useQuery({
    queryKey: ['employees', uid],
    queryFn: () => employeesApi.getEmployee(uid),
    enabled: isEdit,
  });
  const employee = employeeQuery.data;

  // `values` fills the form once the employee loads.
  const form = useForm<CreateEmployeeValues>({
    resolver: isEdit
      ? zodResolver(editEmployeeSchema)
      : zodResolver(createEmployeeSchema),
    defaultValues: DEFAULT_VALUES,
    values: employee && toFormValues(employee),
  });

  const department = useWatch({ control: form.control, name: 'department' });
  const teamsQuery = useQuery({
    queryKey: ['teams', department],
    queryFn: () => employeesApi.getTeams(department ?? ''),
    enabled: !!department,
  });
  const teamOptions = (teamsQuery.data ?? []).map((team) => ({
    value: team.uid,
    label: team.name,
  }));

  const saveEmployee = useMutation({
    mutationFn: ({
      userName,
      email,
      password,
      ...profile
    }: CreateEmployeePayload) =>
      isEdit
        ? employeesApi.updateEmployee({ uid, payload: profile })
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
            ? `This updates ${employee?.fullName}'s profile.`
            : `This creates ${payload.fullName} and their login.`}
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => saveEmployee.mutate(payload),
    });

  // A disabled query stays pending, so `isLoading` is used: it is only true while fetching.
  if (employeeQuery.isLoading) return <PageLoader />;

  if (employeeQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(employeeQuery.error)}
        onRetry={() => employeeQuery.refetch()}
      />
    );
  }

  return (
    <Stack gap="md" maw={880}>
      <PageTop
        title={isEdit ? 'Edit employee' : 'Add employee'}
        description={
          isEdit
            ? `The login (${employee?.userInfo.userName}) can't be changed here.`
            : 'This also creates their login with the USER role.'
        }
        backBtn
        fallbackPath={backPath}
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Stack gap="md">
            {!isEdit && (
              <Card withBorder padding="lg">
                <Stack gap="sm">
                  <div>
                    <Text fw={600}>Account</Text>
                    <Text size="sm" c="dimmed">
                      Used to log in.
                    </Text>
                  </div>
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <FormTextInput
                      name="userName"
                      label="User name"
                      placeholder="maya_rodriguez"
                      leftSection={<IconAt size={16} />}
                      autoComplete="off"
                      withAsterisk
                    />
                    <FormTextInput
                      name="email"
                      label="Email"
                      placeholder="maya.rodriguez@example.com"
                      leftSection={<IconMail size={16} />}
                      autoComplete="off"
                      withAsterisk
                    />
                    <FormPasswordInput
                      name="password"
                      label="Password"
                      placeholder="At least 8 characters"
                      leftSection={<IconLock size={16} />}
                      autoComplete="new-password"
                      withAsterisk
                    />
                    <FormPasswordInput
                      name="confirmPassword"
                      label="Confirm password"
                      placeholder="Repeat the password"
                      leftSection={<IconLock size={16} />}
                      autoComplete="new-password"
                      withAsterisk
                    />
                  </SimpleGrid>
                </Stack>
              </Card>
            )}

            <Card withBorder padding="lg">
              <Stack gap="sm">
                <Text fw={600}>Profile</Text>
                <FormTextInput
                  name="fullName"
                  label="Full name"
                  placeholder="Maya Rodriguez"
                  leftSection={<IconUser size={16} />}
                  withAsterisk
                />
                <FormTextarea
                  name="bio"
                  label="Bio"
                  placeholder="A few words about their work"
                  autosize
                  minRows={3}
                  maxLength={300}
                />
                <FormMultiSelect
                  name="skills"
                  label="Skills"
                  placeholder="Pick up to 10"
                  data={SKILL_OPTIONS}
                  maxValues={10}
                  searchable
                  clearable
                />
              </Stack>
            </Card>

            <Card withBorder padding="lg">
              <Stack gap="sm">
                <Text fw={600}>Job</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <FormSelect
                    name="department"
                    label="Department"
                    placeholder="Pick a department"
                    data={DEPARTMENT_OPTIONS}
                    onValueChange={() => form.setValue('teamUid', '')}
                    withAsterisk
                  />
                  <FormSelect
                    name="teamUid"
                    label="Team"
                    placeholder={
                      department ? 'Pick a team' : 'Pick a department first'
                    }
                    data={teamOptions}
                    disabled={!department || teamsQuery.isPending}
                    withAsterisk
                  />
                  <FormNumberInput
                    name="salary"
                    label="Monthly salary"
                    placeholder="4500"
                    min={0}
                    max={10_000_000}
                    allowDecimal={false}
                    thousandSeparator=","
                    withAsterisk
                  />
                  <FormDateInput
                    name="joinDate"
                    label="Join date"
                    placeholder="Pick a date"
                    leftSection={<IconCalendar size={16} />}
                    maxDate={today}
                    valueFormat="DD MMM YYYY"
                    withAsterisk
                  />
                </SimpleGrid>
                <FormRadioGroup
                  name="employmentType"
                  label="Employment type"
                  withAsterisk
                >
                  <SimpleGrid cols={{ base: 1, xs: 3 }} mt="xs">
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(
                      ([value, label]) => (
                        <Radio key={value} value={value} label={label} />
                      ),
                    )}
                  </SimpleGrid>
                </FormRadioGroup>
                <FormSwitch name="isRemote" label="Works remotely" mt="xs" />
              </Stack>
            </Card>

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

/** The employee's saved values, in the shape the form uses. */
const toFormValues = (employee: Employee): CreateEmployeeValues => ({
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: employee.fullName,
  bio: employee.bio ?? '',
  salary: employee.salary,
  department: employee.teamInfo.department,
  teamUid: employee.teamInfo.uid,
  skills: employee.skills,
  employmentType: employee.employmentType,
  joinDate: dayjs(employee.joinDate).format('YYYY-MM-DD'),
  isRemote: employee.isRemote,
});
