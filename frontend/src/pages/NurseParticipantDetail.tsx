import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNurseParticipantDetail } from '../features/nurse/api';
import type { ParticipantDetail } from '../features/admin/types';
import { normalizeApiError } from '../lib/apiError';
import { InlineFormError } from '../components/feedback/InlineFormError';
import { ParticipantDetailView } from '../components/admin/ParticipantDetailView';
import { StaffDataEntryPanel } from '../components/admin/StaffDataEntryPanel';
import { ROUTES } from '../routes/paths';

export const NurseParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ParticipantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!id) return;
    fetchNurseParticipantDetail(id)
      .then(setData)
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 via-background to-background">
      <header className="border-b border-border bg-surface px-5 py-4">
        <span className="font-sans text-base font-bold text-primary">SnehoAyu Nurse</span>
      </header>
      <div className="mx-auto max-w-md p-6">
        <Link to={ROUTES.NURSE_HOME} className="text-sm font-semibold text-primary">
          ← Back to participants
        </Link>

        {error && <InlineFormError message={error} />}

        {loading ? (
          <div className="py-16 text-center text-sm text-text-muted">Loading…</div>
        ) : data && id ? (
          <div className="mt-4 space-y-4">
            <StaffDataEntryPanel motherProfileId={id} onRefresh={load} />
            <ParticipantDetailView data={data} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
