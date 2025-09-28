import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PublicRouteProps {
  restricted?: boolean;
  redirectPath?: string;
}

const PublicRoute = ({ restricted = false, redirectPath = '/dashboard' }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated && restricted) {
    const from = (location.state as any)?.from?.pathname || redirectPath;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
