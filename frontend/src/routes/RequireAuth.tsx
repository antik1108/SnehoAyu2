import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './paths';
import { LoadingScreen } from '../components/feedback/LoadingScreen';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading || status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
