import { Anchor, Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconMail } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { getErrorMessage } from '@/shared/api/interceptor';
import type { AuthUser } from '@/shared/api/types';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';

export const ProfileSummaryCard = ({ user }: { user: AuthUser }) => {
  const resend = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (result) =>
      notifications.show({ color: 'green', message: result.message }),
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  return (
    <Card withBorder padding="lg">
      <Stack align="center" gap="xs" ta="center">
        <Avatar
          size={72}
          color="white"
          style={{ background: getAvatarGradient(user.userName) }}
        >
          {getInitials(user.userName)}
        </Avatar>
        <Text fz={18} fw={500}>
          {user.userName}
        </Text>
        <Group gap={6} justify="center">
          <Badge variant="light">{user.role}</Badge>
          {user.emailVerified ? (
            <Badge variant="light" color="green">
              Verified
            </Badge>
          ) : (
            <Badge variant="light" color="yellow">
              Not verified
            </Badge>
          )}
        </Group>
      </Stack>

      <Stack gap={8} mt="lg">
        <Group gap={8} wrap="nowrap">
          <IconMail size={16} color="var(--mantine-color-dimmed)" />
          <Text size="sm" truncate>
            {user.email}
          </Text>
        </Group>
        {!user.emailVerified && (
          <Text size="sm" c="dimmed">
            Check your inbox for the link, or{' '}
            <Anchor
              component="button"
              type="button"
              size="sm"
              fw={500}
              disabled={resend.isPending}
              onClick={() => resend.mutate()}
            >
              {resend.isPending ? 'sending...' : 'resend it'}
            </Anchor>
            .
          </Text>
        )}
        {user.createdAt && (
          <Group gap={8} wrap="nowrap">
            <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm">Joined {formatDate(user.createdAt)}</Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
};
