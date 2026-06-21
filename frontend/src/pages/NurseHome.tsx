import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, LogOut, Phone, UserPlus, Building2, Users, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchNurseDashboard, type NurseDashboard } from '../features/nurse/api';
import { normalizeApiError } from '../lib/apiError';
import { InlineFormError } from '../components/feedback/InlineFormError';
import { ROUTES } from '../routes/paths';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="rounded-xl border border-border bg-surface p-4 text-center">
    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
    <p className="mt-2 text-xl font-bold text-text">{value}</p>
    <p className="text-xs text-text-muted">{label}</p>
  </div>
);

/**
 * Nurse role per the PRD: enrol new participants by sitting with the
 * mother during the onboarding wizard at the hospital, and keep an eye on
 * enrollment progress at their own hospital. This is read-only — study
 * group assignment and data export stay researcher-only.
 */
export const NurseHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<NurseDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingEnrol, setConfirmingEnrol] = useState(false);

  useEffect(() => {
    fetchNurseDashboard()
      .then(setData)
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  const handleStartEnrolment = async () => {
    if (!confirmingEnrol) {
      setConfirmingEnrol(true);
      return;
    }
    // Signup is a self-service flow the mother completes on her own
    // account, so it requires no nurse session active — log out and hand
    // the phone to the mother to begin together.
    await logout();
    navigate(ROUTES.WELCOME, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 via-background to-background">
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
        <span className="font-sans text-base font-bold text-primary">SnehoAyu Nurse</span>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-5 py-6">
        {error && <InlineFormError message={error} />}

        {loading ? (
          <div className="py-16 text-center text-sm text-text-muted">Loading…</div>
        ) : data ? (
          <>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-text-muted" aria-hidden="true" />
                <p className="text-sm font-semibold text-text">{data.hospital.name}</p>
              </div>
              {user?.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                  <Phone className="h-3 w-3" aria-hidden="true" /> {user.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatCard icon={<Users className="h-4.5 w-4.5" />} label="Enrolled" value={data.stats.totalEnrolled} />
              <StatCard icon={<CheckCircle2 className="h-4.5 w-4.5" />} label="Onboarded" value={data.stats.onboardedCount} />
              <StatCard icon={<Clock className="h-4.5 w-4.5" />} label="Pending" value={data.stats.pendingCount} />
            </div>

            <button
              type="button"
              onClick={handleStartEnrolment}
              className="flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            >
              <UserPlus className="h-4.5 w-4.5" aria-hidden="true" />
              {confirmingEnrol ? 'Tap again to log out and start signup' : 'Enrol New Participant'}
            </button>
            {confirmingEnrol && (
              <p className="text-center text-xs text-text-muted">
                This logs you out so the mother can create her own account.{' '}
                <button type="button" onClick={() => setConfirmingEnrol(false)} className="font-semibold text-primary">
                  Cancel
                </button>
              </p>
            )}

            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                Participants at this hospital
              </div>
              {data.participants.length === 0 ? (
                <p className="rounded-xl border border-border bg-surface p-4 text-center text-sm text-text-muted">
                  No participants enrolled yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {data.participants.map((p) => (
                    <Link
                      key={p.id}
                      to={`/nurse/participants/${p.id}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-surface p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-text">{p.participantCode ?? p.id.slice(0, 8)}</p>
                        <p className="text-xs text-text-muted capitalize">{p.studyGroup ?? 'Unassigned'} group</p>
                      </div>
                      {p.onboardingCompletedAt ? (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">Onboarded</span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Pending</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};
