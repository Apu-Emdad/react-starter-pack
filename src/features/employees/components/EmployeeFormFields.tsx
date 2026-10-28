import { Card, Radio, SimpleGrid, Stack, Text } from '@mantine/core';
import {
  IconAt,
  IconCalendar,
  IconLock,
  IconMail,
  IconUser,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
import { employeesApi } from '../api/employeesApi';
import {
  DEPARTMENT_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  SKILL_OPTIONS,
} from '../types';

interface Props {
  /** Shows the login fields. Only the create form has them, since update can't change the login. */
  withAccount?: boolean;
}

const DEPARTMENT_OPTIONS = Object.entries(DEPARTMENT_LABELS).map(
  ([value, label]) => ({ value, label }),
);

/** Fields shared by the create and edit forms. They read the form from <FormProvider>. */
export const EmployeeFormFields = ({ withAccount = false }: Props) => {
  const { setValue } = useFormContext();
  const department = useWatch({ name: 'department' }) as string;
  const teamsQuery = useQuery({
    queryKey: ['teams', department],
    queryFn: () => employeesApi.getTeams(department),
    enabled: !!department,
  });
  const [today] = useState(() => dayjs().format('YYYY-MM-DD'));

  const teamOptions = (teamsQuery.data ?? []).map((team) => ({
    value: team.uid,
    label: team.name,
  }));

  return (
    <Stack gap="md">
      {withAccount && (
        <Section title="Account" description="Used to log in.">
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
        </Section>
      )}

      <Section title="Profile">
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
      </Section>

      <Section title="Job">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <FormSelect
            name="department"
            label="Department"
            placeholder="Pick a department"
            data={DEPARTMENT_OPTIONS}
            onValueChange={() => setValue('teamUid', '')}
            withAsterisk
          />
          <FormSelect
            name="teamUid"
            label="Team"
            placeholder={department ? 'Pick a team' : 'Pick a department first'}
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
            {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
              <Radio key={value} value={value} label={label} />
            ))}
          </SimpleGrid>
        </FormRadioGroup>
        <FormSwitch name="isRemote" label="Works remotely" mt="xs" />
      </Section>
    </Stack>
  );
};

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <Card withBorder padding="lg">
      <Stack gap="sm">
        <div>
          <Text fw={600}>{title}</Text>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </div>
        {children}
      </Stack>
    </Card>
  );
};
