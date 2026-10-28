import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account.">
      <LoginForm />
    </AuthLayout>
  );
};
