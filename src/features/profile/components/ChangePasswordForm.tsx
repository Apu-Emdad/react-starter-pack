import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLock } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch } from '@/app/store/hooks';
import { setSession } from '@/features/auth/store/authSlice';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormPasswordInput } from '@/shared/components/ui/FormFields';
import { profileApi } from '../api/profileApi';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '../schemas/profile.schema';

const DEFAULT_VALUES: ChangePasswordValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // The API ends every session and returns a new pair, so this tab stays logged in.
  const changePassword = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (result) => {
      dispatch(setSession(result.data));
      form.reset(DEFAULT_VALUES);
      notifications.show({ color: 'green', message: result.message });
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const onSubmit = ({ currentPassword, newPassword }: ChangePasswordValues) =>
    changePassword.mutate({ currentPassword, newPassword });

  return (
    <Card withBorder padding="lg">
      <Title order={3} fz={16}>
        Password
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Changing it logs you out on every other device.
      </Text>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Stack gap="sm">
            <FormPasswordInput
              name="currentPassword"
              label="Current password"
              leftSection={<IconLock size={16} />}
              autoComplete="current-password"
            />
            <FormPasswordInput
              name="newPassword"
              label="New password"
              placeholder="At least 8 characters"
              leftSection={<IconLock size={16} />}
              autoComplete="new-password"
            />
            <FormPasswordInput
              name="confirmPassword"
              label="Confirm new password"
              leftSection={<IconLock size={16} />}
              autoComplete="new-password"
            />
            <Group justify="flex-end">
              <Button type="submit" loading={changePassword.isPending}>
                Change password
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Card>
  );
};
