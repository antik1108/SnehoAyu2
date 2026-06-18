import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStoredLanguage } from '../lib/authStorage';
import { ROUTES } from './paths';

export const LanguageGate: React.FC = () => {
  const lang = getStoredLanguage();

  if (!lang) {
    return <Navigate to={ROUTES.LANGUAGE_SELECT} replace />;
  }

  return <Outlet />;
};
