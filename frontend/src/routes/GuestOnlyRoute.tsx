import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getHomeRouteForRole } from './paths';
import { LoadingScreen } from '../components/feedback/LoadingScreen';

export const GuestOnlyRoute: React.FC = () => {
  const { status, isLoading, user } = useAuth();

  if (isLoading || status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'authenticated') {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
};
