import { Stack, Text, ThemeIcon } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: Props) => {
  return (
    <Stack align="center" gap="xs" py="xl">
      <ThemeIcon variant="light" size={48} radius="xl">
        <IconInbox size={24} />
      </ThemeIcon>
      <Text fw={500}>{title}</Text>
      {description && (
        <Text c="dimmed" size="sm" ta="center">
          {description}
        </Text>
      )}
      {action}
    </Stack>
  );
};
