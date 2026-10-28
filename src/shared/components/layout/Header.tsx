import {
  Avatar,
  Badge,
  Box,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { authApi } from '@/features/auth/api/authApi';
import { clearSession } from '@/features/auth/store/authSlice';
import { getAvatarGradient, getInitials } from '@/shared/utils/format';
import { ColorSchemeToggle } from '../ui/ColorSchemeToggle';
import { Logo } from '../ui/Logo';

interface Props {
  navOpened: boolean;
  onToggleNav: () => void;
}

export const Header = ({ navOpened, onToggleNav }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // The session ends on this device even if the API call fails.
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      dispatch(clearSession());
      queryClient.clear();
    },
  });

  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="sm">
        <Burger
          opened={navOpened}
          onClick={onToggleNav}
          hiddenFrom="sm"
          size="sm"
          aria-label="Toggle navigation"
        />
        <Box hiddenFrom="sm">
          <Logo />
        </Box>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <ColorSchemeToggle />
        {user && (
          <Menu position="bottom-end" width={220}>
            <Menu.Target>
              <UnstyledButton aria-label="Open user menu">
                <Group gap="xs" wrap="nowrap">
                  <Avatar
                    size={30}
                    color="white"
                    style={{ background: getAvatarGradient(user.userName) }}
                  >
                    {getInitials(user.userName)}
                  </Avatar>
                  <Text size="sm" visibleFrom="sm">
                    {user.userName}
                  </Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <Text size="xs" c="dimmed">
                  {user.email}
                </Text>
                <Badge mt={6} size="sm" variant="light">
                  {user.role}
                </Badge>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={() => logout.mutate()}
              >
                Log out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Group>
  );
};
