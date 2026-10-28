import { Box, Text } from '@mantine/core';

export const WelcomeBanner = ({ name }: { name: string }) => {
  return (
    <Box
      p="lg"
      c="white"
      style={{ borderRadius: 14, background: 'var(--app-gradient)' }}
    >
      <Text fz={20} fw={500}>
        Good to see you, {name}
      </Text>
      <Text opacity={0.85}>Here is what's happening today.</Text>
    </Box>
  );
};
