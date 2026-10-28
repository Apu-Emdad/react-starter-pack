import { Alert, Button, Stack, Text } from '@mantine/core';
import {
  IconArrowRight,
  IconLock,
  IconMail,
  IconUser,
} from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import {
  FormPasswordInput,
  FormTextInput,
} from '@/shared/components/ui/FormFields';
import { ROUTES } from '@/shared/constants/routes';
import { authApi } from '../api/authApi';
import {
  registerSchema,
  type RegisterValues,
} from '../schemas/register.schema';
import { setSession } from '../store/authSlice';

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // The API logs the new user in, so go straight to the dashboard.
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (payload) => {
      dispatch(setSession(payload));
      navigate(ROUTES.dashboard, { replace: true });
    },
  });
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = ({ confirmPassword: _confirm, ...values }: RegisterValues) =>
    register.mutate(values);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Stack gap="sm">
          {register.isError && (
            <Alert color="red" variant="light">
              {getErrorMessage(register.error)}
            </Alert>
          )}
          <FormTextInput
            name="userName"
            label="User name"
            placeholder="apu_emdad"
            leftSection={<IconUser size={16} />}
            autoComplete="username"
          />
          <FormTextInput
            name="email"
            label="Email"
            placeholder="name@company.com"
            leftSection={<IconMail size={16} />}
            autoComplete="email"
          />
          <FormPasswordInput
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            leftSection={<IconLock size={16} />}
            autoComplete="new-password"
          />
          <FormPasswordInput
            name="confirmPassword"
            label="Confirm password"
            placeholder="Repeat your password"
            leftSection={<IconLock size={16} />}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            mt="xs"
            loading={register.isPending}
            rightSection={<IconArrowRight size={16} />}
          >
            Create account
          </Button>
          <Text ta="center" size="sm" c="dimmed">
            Have an account?{' '}
            <Text component={Link} to={ROUTES.login} span c="brand" fw={500}>
              Log in
            </Text>
          </Text>
        </Stack>
      </form>
    </FormProvider>
  );
};
