import { Navigate, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/services/auth';

export const AuthenticatedGuard: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
