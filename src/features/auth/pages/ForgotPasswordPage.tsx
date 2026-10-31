import { Alert, Anchor, Button, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconMail, IconMailCheck } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormTextInput } from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { authApi } from '../api/authApi';
import { AuthLayout } from '../components/AuthLayout';
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '../schemas/forgotPassword.schema';

const BackToLogin = () => (
  <Anchor component={Link} to={ROUTES.login} size="sm" ta="center">
    <IconArrowLeft size={14} style={{ verticalAlign: -2 }} /> Back to login
  </Anchor>
);

/** The API answers the same whether the email exists or not, so this page does too. */
export const ForgotPasswordPage = () => {
  const forgotPassword = useMutation({ mutationFn: authApi.forgotPassword });
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  if (forgotPassword.isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`If an account uses ${forgotPassword.variables.email}, we sent it a link to reset the password. The link works for 30 minutes.`}
      >
        <Stack gap="md">
          <ThemeIcon size={48} radius="xl" variant="light">
            <IconMailCheck size={24} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            No email? Check your spam folder, or{' '}
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={() => forgotPassword.reset()}
            >
              try again
            </Anchor>
            .
          </Text>
          <BackToLogin />
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset it."
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            forgotPassword.mutate(values),
          )}
          noValidate
        >
          <Stack gap="sm">
            {forgotPassword.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(forgotPassword.error)}
              </Alert>
            )}
            <FormTextInput
              name="email"
              label="Email"
              placeholder="name@company.com"
              leftSection={<IconMail size={16} />}
              autoComplete="email"
            />
            <Button type="submit" mt="xs" loading={forgotPassword.isPending}>
              Send reset link
            </Button>
            <BackToLogin />
          </Stack>
        </form>
      </FormProvider>
    </AuthLayout>
  );
};
