import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getHomeRouteForRole } from './paths';
import type { AuthUser } from '../lib/authStorage';

export const RequireRole: React.FC<{ roles: AuthUser['role'][]; children: React.ReactNode }> = ({
  roles,
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || !roles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  return <>{children}</>;
};
