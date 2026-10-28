import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light');

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      aria-label="Toggle color scheme"
      onClick={() => setColorScheme(scheme === 'dark' ? 'light' : 'dark')}
    >
      {scheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
};
