import { Grid, Stack } from '@mantine/core';
import { useAppSelector } from '@/app/store/hooks';
import { PageTop } from '@/shared/components/layout/PageTop';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { ProfileDetailsForm } from '../components/ProfileDetailsForm';
import { ProfileSummaryCard } from '../components/ProfileSummaryCard';

/** The logged-in user's own account. Reads the user from the auth store. */
export const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <Stack gap="lg">
      <PageTop
        title="Profile"
        description="Your account details and password."
      />
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <ProfileSummaryCard user={user} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <ProfileDetailsForm user={user} />
            <ChangePasswordForm />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
