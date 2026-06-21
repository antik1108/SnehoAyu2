import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getHomeRouteForRole } from './paths';

export const GuestOnlyRoute: React.FC = () => {
  const { status, isLoading, user } = useAuth();

  if (isLoading || status === 'loading') {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center bg-background text-text"
        style={{ minHeight: '100vh' }}
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
};
