import { Box, Group, RingProgress, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { Logo } from '@/shared/components/ui/Logo';
import classes from './AuthLayout.module.css';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Split screen: a brand panel on large screens, and the form. */
export const AuthLayout = ({ title, subtitle, children }: Props) => {
  return (
    <Box className={classes.root}>
      <Box className={classes.brand}>
        <div className={`${classes.blob} ${classes.blobOne}`} />
        <div className={`${classes.blob} ${classes.blobTwo}`} />
        <div className={`${classes.blob} ${classes.blobThree}`} />
        <Box className={classes.content}>
          <Logo color="white" />
        </Box>
        <Box className={classes.content}>
          <Box className={classes.glass}>
            <Group gap="sm" wrap="nowrap">
              <RingProgress
                size={56}
                thickness={6}
                roundCaps
                sections={[{ value: 77, color: '#4ADE80' }]}
                label={
                  <Text ta="center" fw={500} size="sm" c="white">
                    77
                  </Text>
                }
              />
              <div>
                <Text size="xs" c="rgba(255,255,255,0.7)">
                  Health score
                </Text>
                <Text fw={500}>Looking good</Text>
              </div>
            </Group>
          </Box>
          <Title order={1} fz={32} lh={1.2} c="white">
            Ship with
            <br />
            confidence.
          </Title>
          <Text mt="sm" maw={280} c="rgba(255,255,255,0.7)">
            One short line about what your product does.
          </Text>
        </Box>
      </Box>

      <Box className={classes.form}>
        <Stack w="100%" maw={380} gap="xs">
          <Box hiddenFrom="lg" mb="md">
            <Logo />
          </Box>
          <Title order={2} fz={24}>
            {title}
          </Title>
          <Text c="dimmed" mb="sm">
            {subtitle}
          </Text>
          {children}
        </Stack>
      </Box>
    </Box>
  );
};
