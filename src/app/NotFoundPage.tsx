import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

export const NotFoundPage = () => {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="xs">
        <Title order={2}>Page not found</Title>
        <Text c="dimmed">The page you are looking for doesn't exist.</Text>
        <Button component={Link} to={ROUTES.dashboard} mt="sm">
          Go to dashboard
        </Button>
      </Stack>
    </Center>
  );
};
