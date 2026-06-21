import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchParticipantDetail } from '../../features/admin/api';
import type { ParticipantDetail as ParticipantDetailType } from '../../features/admin/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';
import { ROUTES } from '../../routes/paths';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ParticipantDetailView } from '../../components/admin/ParticipantDetailView';
import { StaffDataEntryPanel } from '../../components/admin/StaffDataEntryPanel';

export const ParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ParticipantDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!id) return;
    fetchParticipantDetail(id)
      .then(setData)
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="mx-auto max-w-4xl p-6">
        <Link to={ROUTES.ADMIN_PARTICIPANTS} className="text-sm font-semibold text-primary">
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
