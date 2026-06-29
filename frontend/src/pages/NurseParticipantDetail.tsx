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
    <div className="care-canvas min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/88 px-5 py-4 backdrop-blur-xl">
        <span className="font-sans text-lg font-extrabold text-text">SnehoAyu Nurse</span>
      </header>
      <div className="mx-auto max-w-5xl p-5 lg:p-8">
        <Link to={ROUTES.NURSE_HOME} className="care-chip">
          ← Back to participants
        </Link>

        {error && <InlineFormError message={error} />}

        {loading ? (
          <div className="py-16 text-center text-sm text-text-muted">Loading…</div>
        ) : data && id ? (
          <div className="mt-5 space-y-5">
            <StaffDataEntryPanel motherProfileId={id} onRefresh={load} />
            <ParticipantDetailView data={data} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
