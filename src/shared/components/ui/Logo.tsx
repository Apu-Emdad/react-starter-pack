import { Group, Text } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';

/** "App name" is a placeholder: rename it when you start a project from the starter. */
export const APP_NAME = 'App name';

export const Logo = ({ color }: { color?: string }) => {
  return (
    <Group gap={8} wrap="nowrap">
      <Group
        justify="center"
        w={28}
        h={28}
        style={{
          borderRadius: 8,
          background: 'var(--app-gradient)',
          color: '#fff',
        }}
      >
        <IconShieldCheck size={16} />
      </Group>
      <Text fw={500} fz={16} c={color}>
        {APP_NAME}
      </Text>
    </Group>
  );
};
