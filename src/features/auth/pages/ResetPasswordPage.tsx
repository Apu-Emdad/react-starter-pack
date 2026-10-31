import { Alert, Anchor, Button, Stack, ThemeIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLink, IconLock } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormPasswordInput } from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { authApi } from '../api/authApi';
import { AuthLayout } from '../components/AuthLayout';
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '../schemas/resetPassword.schema';

/**
 * Opened from the reset email: `/reset-password?token=...`
 *
 * The password rules are checked here first, so a 400 from the API means the link
 * is invalid, expired or used, and the page offers a new one.
 */
export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const resetPassword = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      navigate(ROUTES.login, { replace: true });
    },
  });
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const linkExpired =
    !token ||
    (isAxiosError(resetPassword.error) &&
      resetPassword.error.response?.status === 400);

  if (linkExpired) {
    return (
      <AuthLayout
        title="This link doesn't work"
        subtitle="Reset links work once and expire after 30 minutes. Ask for a new one."
      >
        <Stack gap="md">
          <ThemeIcon size={48} radius="xl" variant="light" color="red">
            <IconLink size={24} />
          </ThemeIcon>
          <Button component={Link} to={ROUTES.forgotPassword}>
            Send a new link
          </Button>
          <Anchor component={Link} to={ROUTES.login} size="sm" ta="center">
            Back to login
          </Anchor>
        </Stack>
      </AuthLayout>
    );
  }

  const onSubmit = ({ password }: ResetPasswordValues) =>
    resetPassword.mutate({ token, password });

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="You'll be logged out everywhere and can log in with the new one."
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Stack gap="sm">
            {resetPassword.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(resetPassword.error)}
              </Alert>
            )}
            <FormPasswordInput
              name="password"
              label="New password"
              placeholder="At least 8 characters"
              leftSection={<IconLock size={16} />}
              autoComplete="new-password"
            />
            <FormPasswordInput
              name="confirmPassword"
              label="Confirm new password"
              placeholder="Repeat your password"
              leftSection={<IconLock size={16} />}
              autoComplete="new-password"
            />
            <Button type="submit" mt="xs" loading={resetPassword.isPending}>
              Reset password
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </AuthLayout>
  );
};
