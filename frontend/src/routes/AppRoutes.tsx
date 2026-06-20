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
import { Dashboard } from '../pages/Dashboard';
import { Checklist } from '../pages/Checklist';
import { KnowledgeMCQ } from '../pages/assessments/KnowledgeMCQ';
import { Who5Assessment } from '../pages/assessments/Who5Assessment';
import { PsocAssessment } from '../pages/assessments/PsocAssessment';
import { Growth } from '../pages/Growth';
import { AddReading } from '../pages/growth/AddReading';
import { LearningHub } from '../pages/LearningHub';
import { Profile } from '../pages/Profile';
import { DangerSigns } from '../pages/DangerSigns';

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
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.CHECKLIST}
          element={
            <RequireAuth>
              <Checklist />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.KNOWLEDGE_ASSESSMENT}
          element={
            <RequireAuth>
              <KnowledgeMCQ />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.WHO5_ASSESSMENT}
          element={
            <RequireAuth>
              <Who5Assessment />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.PSOC_ASSESSMENT}
          element={
            <RequireAuth>
              <PsocAssessment />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.GROWTH}
          element={
            <RequireAuth>
              <Growth />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.ADD_GROWTH_READING}
          element={
            <RequireAuth>
              <AddReading />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.LEARN}
          element={
            <RequireAuth>
              <LearningHub />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.DANGER_SIGNS}
          element={
            <RequireAuth>
              <DangerSigns />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
