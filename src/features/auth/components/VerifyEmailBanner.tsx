import { Alert, Anchor, Text } from '@mantine/core';
import { useSessionStorage } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconMailExclamation } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import { authApi } from '../api/authApi';

/** Shown in the app shell until the email is verified. Dismissing hides it until the tab closes. */
export const VerifyEmailBanner = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [dismissed, setDismissed] = useSessionStorage({
    key: 'verify-email-banner-dismissed',
    defaultValue: false,
  });

  const resend = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (result) =>
      notifications.show({ color: 'green', message: result.message }),
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  // `=== false`: an older saved session without the field doesn't show it.
  if (user?.emailVerified !== false || dismissed) return null;

  return (
    <Alert
      variant="light"
      color="yellow"
      icon={<IconMailExclamation size={18} />}
      withCloseButton
      closeButtonLabel="Dismiss"
      onClose={() => setDismissed(true)}
      py="xs"
      mb="md"
    >
      <Text size="sm">
        Verify your email. We sent a link to <b>{user.email}</b>.{' '}
        <Anchor
          component="button"
          type="button"
          size="sm"
          fw={500}
          disabled={resend.isPending}
          onClick={() => resend.mutate()}
        >
          {resend.isPending ? 'Sending...' : 'Resend link'}
        </Anchor>
      </Text>
    </Alert>
  );
};
