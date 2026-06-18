import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './paths';
import { useTranslation } from 'react-i18next';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, isLoading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (isLoading || status === 'loading') {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center bg-background text-text"
        aria-live="polite"
        style={{ minHeight: '100vh' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="font-sans text-sm font-medium">{t('common.loading', 'Loading…')}</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
