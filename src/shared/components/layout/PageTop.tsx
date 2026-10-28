import { Button, Group, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

interface Props {
  title: string;
  description?: string;
  backBtn?: boolean;
  /** Where Back goes when there is no page to go back to, e.g. a link opened in a new tab. */
  fallbackPath?: string;
  /** Shown on the right of the title, e.g. an "Add" button. */
  rightSection?: ReactNode;
}

export const PageTop = ({
  title,
  description,
  backBtn = false,
  fallbackPath = ROUTES.root,
  rightSection,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // React Router gives the first page of a visit the key 'default'.
  const handleBack = () =>
    location.key === 'default' ? navigate(fallbackPath) : navigate(-1);

  return (
    <div>
      {backBtn && (
        <Button
          variant="subtle"
          color="gray"
          size="compact-sm"
          leftSection={<IconArrowLeft size={16} />}
          mb="xs"
          onClick={handleBack}
        >
          Back
        </Button>
      )}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} fz={22}>
            {title}
          </Title>
          {description && <Text c="dimmed">{description}</Text>}
        </div>
        {rightSection}
      </Group>
    </div>
  );
};
