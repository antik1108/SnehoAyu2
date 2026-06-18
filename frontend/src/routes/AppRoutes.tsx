import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './paths';
import { RootRedirect } from './RootRedirect';
import { LanguageGate } from './LanguageGate';
import { GuestOnlyRoute } from './GuestOnlyRoute';
import { RequireAuth } from './RequireAuth';
import { LanguageSelect } from '../pages/LanguageSelect';
import { Welcome } from '../pages/Welcome';
import { SignupPhone } from '../pages/SignupPhone';
import { Login } from '../pages/Login';
import { CreatePin } from '../pages/CreatePin';
import { PinLogin } from '../pages/PinLogin';
import { MotherProfileForm } from '../pages/MotherProfileForm';
import { BabyProfileForm } from '../pages/BabyProfileForm';
import { HospitalCodeEntry } from '../pages/HospitalCodeEntry';
import { SignupComplete } from '../pages/SignupComplete';

const NotFound: React.FC = () => {
  return (
    <div
      className="flex h-screen flex-col items-center justify-center bg-background text-text p-6"
      style={{ minHeight: '100vh' }}
    >
      <h1 className="font-sans text-3xl font-bold mb-2">404</h1>
      <p className="text-sm text-text-muted mb-6">Page not found / পৃষ্ঠাটি পাওয়া যায়নি</p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Go Home / হোম পেজে যান
      </a>
    </div>
  );
};

const DashboardPlaceholder: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-background text-text">
    <p>Dashboard Page Placeholder</p>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<RootRedirect />} />
      <Route path={ROUTES.LANGUAGE_SELECT} element={<LanguageSelect />} />

      <Route element={<LanguageGate />}>
        <Route element={<GuestOnlyRoute />}>
          <Route path={ROUTES.WELCOME} element={<Welcome />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.PIN_LOGIN} element={<PinLogin />} />
        </Route>

        <Route path={ROUTES.SIGNUP_PHONE} element={<SignupPhone />} />

        <Route
          path={ROUTES.CREATE_PIN}
          element={
            <RequireAuth>
              <CreatePin />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.MOTHER_PROFILE}
          element={
            <RequireAuth>
              <MotherProfileForm />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.BABY_PROFILE}
          element={
            <RequireAuth>
              <BabyProfileForm />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.HOSPITAL_CODE}
          element={
            <RequireAuth>
              <HospitalCodeEntry />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.SIGNUP_COMPLETE}
          element={
            <RequireAuth>
              <SignupComplete />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <RequireAuth>
              <DashboardPlaceholder />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
