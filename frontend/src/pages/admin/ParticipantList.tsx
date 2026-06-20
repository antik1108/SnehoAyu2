import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import { fetchParticipants, assignStudyGroup } from '../../features/admin/api';
import type { ParticipantListItem } from '../../features/admin/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';
import { scheduleTelehealthSession } from '../../features/telehealth/api';

export const ParticipantList: React.FC = () => {
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchParticipants();
      setParticipants(data);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAssign = async (id: string, group: 'study' | 'control') => {
    setAssigningId(id);
    setError(null);
    try {
      await assignStudyGroup(id, group);
      await load();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-sans text-2xl font-bold text-text">Participants</h1>
          <Link to="/admin/hospitals" className="text-sm font-semibold text-primary">Manage Hospitals →</Link>
        </div>
        <p className="text-sm text-text-muted mb-6">Enrolled mothers across all study sites.</p>

        {error && <InlineFormError message={error} />}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-text-muted">Loading…</div>
        ) : participants.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            No participants enrolled yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs font-semibold uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Stratum</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-technical">
                      <Link to={`/admin/participants/${p.id}`} className="text-primary hover:underline">
                        {p.participantCode ?? p.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{p.hospital?.name ?? '—'}</td>
                    <td className="px-4 py-3 capitalize">{p.studyGroup ?? 'Unassigned'}</td>
                    <td className="px-4 py-3">{p.birthWeightStratum ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p.onboardingCompletedAt ? (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
                          Onboarded
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!p.studyGroup && !p.participantCode && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={assigningId === p.id}
                            onClick={() => handleAssign(p.id, 'study')}
                            className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
                          >
                            Study
                          </button>
                          <button
                            type="button"
                            disabled={assigningId === p.id}
                            onClick={() => handleAssign(p.id, 'control')}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-slate-50 disabled:opacity-50"
                          >
                            Control
                          </button>
                        </div>
                      )}
                      {p.onboardingCompletedAt && (
                        <button
                          type="button"
                          onClick={() => void scheduleTelehealthSession(p.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-teal-600 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                        >
                          <Video className="h-3.5 w-3.5" aria-hidden="true" />
                          Video Call
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
