import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getStoredLanguage, hasAuthenticatedPreviously } from '../lib/authStorage';
import { ROUTES, getHomeRouteForRole } from './paths';
import { LoadingScreen } from '../components/feedback/LoadingScreen';

export const RootRedirect: React.FC = () => {
  const { status, isLoading, user } = useAuth();
  const lang = getStoredLanguage();

  if (isLoading || status === 'loading') {
    return <LoadingScreen />;
  }

  if (!lang) {
    return <Navigate to={ROUTES.LANGUAGE_SELECT} replace />;
  }

  if (status === 'authenticated') {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  if (hasAuthenticatedPreviously()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Navigate to={ROUTES.WELCOME} replace />;
};
