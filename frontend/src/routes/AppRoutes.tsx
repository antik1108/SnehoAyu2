import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './paths';
import { RootRedirect } from './RootRedirect';
import { LanguageGate } from './LanguageGate';
import { GuestOnlyRoute } from './GuestOnlyRoute';
import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';
import { LoadingScreen } from '../components/feedback/LoadingScreen';

const LanguageSelect = lazy(() => import('../pages/LanguageSelect').then(m => ({ default: m.LanguageSelect })));
const Welcome = lazy(() => import('../pages/Welcome').then(m => ({ default: m.Welcome })));
const SignupPhone = lazy(() => import('../pages/SignupPhone').then(m => ({ default: m.SignupPhone })));
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const CreatePin = lazy(() => import('../pages/CreatePin').then(m => ({ default: m.CreatePin })));
const PinLogin = lazy(() => import('../pages/PinLogin').then(m => ({ default: m.PinLogin })));
const MotherProfileForm = lazy(() => import('../pages/MotherProfileForm').then(m => ({ default: m.MotherProfileForm })));
const BabyProfileForm = lazy(() => import('../pages/BabyProfileForm').then(m => ({ default: m.BabyProfileForm })));
const HospitalCodeEntry = lazy(() => import('../pages/HospitalCodeEntry').then(m => ({ default: m.HospitalCodeEntry })));
const SignupComplete = lazy(() => import('../pages/SignupComplete').then(m => ({ default: m.SignupComplete })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Checklist = lazy(() => import('../pages/Checklist').then(m => ({ default: m.Checklist })));
const KnowledgeMCQ = lazy(() => import('../pages/assessments/KnowledgeMCQ').then(m => ({ default: m.KnowledgeMCQ })));
const Who5Assessment = lazy(() => import('../pages/assessments/Who5Assessment').then(m => ({ default: m.Who5Assessment })));
const PsocAssessment = lazy(() => import('../pages/assessments/PsocAssessment').then(m => ({ default: m.PsocAssessment })));
const Growth = lazy(() => import('../pages/Growth').then(m => ({ default: m.Growth })));
const AddReading = lazy(() => import('../pages/growth/AddReading').then(m => ({ default: m.AddReading })));
const LearningHub = lazy(() => import('../pages/LearningHub').then(m => ({ default: m.LearningHub })));
const Profile = lazy(() => import('../pages/Profile').then(m => ({ default: m.Profile })));
const DangerSigns = lazy(() => import('../pages/DangerSigns').then(m => ({ default: m.DangerSigns })));
const ParticipantList = lazy(() => import('../pages/admin/ParticipantList').then(m => ({ default: m.ParticipantList })));
const NurseHome = lazy(() => import('../pages/NurseHome').then(m => ({ default: m.NurseHome })));
const NurseParticipantDetail = lazy(() => import('../pages/NurseParticipantDetail').then(m => ({ default: m.NurseParticipantDetail })));
const ParticipantDetail = lazy(() => import('../pages/admin/ParticipantDetail').then(m => ({ default: m.ParticipantDetail })));
const HospitalManagement = lazy(() => import('../pages/admin/HospitalManagement').then(m => ({ default: m.HospitalManagement })));
const TdscTracker = lazy(() => import('../pages/assessments/TdscTracker').then(m => ({ default: m.TdscTracker })));
const ImmunizationTracker = lazy(() => import('../pages/ImmunizationTracker').then(m => ({ default: m.ImmunizationTracker })));
const BreastfeedingAssessment = lazy(() => import('../pages/assessments/BreastfeedingAssessment').then(m => ({ default: m.BreastfeedingAssessment })));
const MessageHistory = lazy(() => import('../pages/MessageHistory').then(m => ({ default: m.MessageHistory })));

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
    <Suspense fallback={<LoadingScreen />}>
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
          <Route
            path={ROUTES.TDSC}
            element={
              <RequireAuth>
                <TdscTracker />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.MESSAGE_HISTORY}
            element={
              <RequireAuth>
                <MessageHistory />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.BREASTFEEDING_ASSESSMENT}
            element={
              <RequireAuth>
                <BreastfeedingAssessment />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.IMMUNIZATION}
            element={
              <RequireAuth>
                <ImmunizationTracker />
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.NURSE_HOME}
            element={
              <RequireAuth>
                <RequireRole roles={['nurse']}>
                  <NurseHome />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.NURSE_PARTICIPANT_DETAIL}
            element={
              <RequireAuth>
                <RequireRole roles={['nurse']}>
                  <NurseParticipantDetail />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.ADMIN_PARTICIPANTS}
            element={
              <RequireAuth>
                <RequireRole roles={['researcher']}>
                  <ParticipantList />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.ADMIN_PARTICIPANT_DETAIL}
            element={
              <RequireAuth>
                <RequireRole roles={['researcher']}>
                  <ParticipantDetail />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOSPITALS}
            element={
              <RequireAuth>
                <RequireRole roles={['researcher']}>
                  <HospitalManagement />
                </RequireRole>
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

