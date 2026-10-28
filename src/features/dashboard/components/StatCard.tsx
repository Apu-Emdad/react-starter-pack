import { Card, Group, Skeleton, Text, ThemeIcon } from '@mantine/core';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: number | undefined;
  icon: ReactNode;
  color: string;
}

export const StatCard = ({ label, value, icon, color }: Props) => {
  return (
    <Card withBorder padding="md">
      <Group justify="space-between">
        <Text c="dimmed" size="sm">
          {label}
        </Text>
        <ThemeIcon variant="light" color={color} size={30} radius="xl">
          {icon}
        </ThemeIcon>
      </Group>
      {value === undefined ? (
        <Skeleton h={32} w={80} mt={8} />
      ) : (
        <Text fz={28} fw={500} mt={4}>
          {value.toLocaleString()}
        </Text>
      )}
    </Card>
  );
};
