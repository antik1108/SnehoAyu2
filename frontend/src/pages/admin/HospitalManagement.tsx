import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Stethoscope, Users, Phone } from 'lucide-react';
import { fetchHospitals, createHospital, updateHospital, downloadExport, fetchHospitalDetail } from '../../features/admin/api';
import type { Hospital, HospitalDetail } from '../../features/admin/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';
import { ROUTES } from '../../routes/paths';
import { AdminHeader } from '../../components/admin/AdminHeader';

const HospitalCard: React.FC<{ hospital: Hospital; onToggleActive: () => void }> = ({ hospital, onToggleActive }) => {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<HospitalDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const toggleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !detail) {
      setLoadingDetail(true);
      setDetailError(null);
      try {
        setDetail(await fetchHospitalDetail(hospital.id));
      } catch (err) {
        setDetailError(normalizeApiError(err).message);
      } finally {
        setLoadingDetail(false);
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface">
      <button type="button" onClick={toggleExpand} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text">{hospital.name} ({hospital.code})</p>
          <p className="text-xs text-text-muted">
            {hospital.district} · {hospital.emergencyPhone ?? 'No emergency phone set'}
            {typeof hospital.participantCount === 'number' && (
              <> · {hospital.participantCount} participants · {hospital.nurseCount ?? 0} nurses</>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onToggleActive(); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onToggleActive(); } }}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${hospital.isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'}`}
          >
            {hospital.isActive ? 'Enrolling' : 'Closed'}
          </span>
          <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-4">
          {loadingDetail && <p className="text-sm text-text-muted">Loading…</p>}
          {detailError && <InlineFormError message={detailError} />}
          {detail && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
                  Nurses ({detail.nurses.length})
                </div>
                {detail.nurses.length === 0 ? (
                  <p className="text-sm text-text-muted">No nurses assigned to this hospital yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {detail.nurses.map((n) => (
                      <div key={n.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <span className="text-text">{n.fullName} {n.employeeId ? `(${n.employeeId})` : ''}</span>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Phone className="h-3 w-3" aria-hidden="true" /> {n.phone}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to={`${ROUTES.ADMIN_PARTICIPANTS}?hospitalId=${hospital.id}&hospitalName=${encodeURIComponent(hospital.name)}`}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
              >
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                View {detail.participants.length} participants at this hospital
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const emptyForm = { name: '', code: '', district: '', type: 'primary_site', emergencyPhone: '' };

export const HospitalManagement: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setHospitals(await fetchHospitals());
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createHospital(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (hospital: Hospital) => {
    try {
      await updateHospital(hospital.id, { isActive: !hospital.isActive });
      await load();
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  const handleExport = async (anonymize: boolean) => {
    setExporting(true);
    try {
      await downloadExport(anonymize);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-sans text-2xl font-bold text-text">Hospital Management</h1>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={exporting}
              onClick={() => handleExport(true)}
              className="rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
            >
              Export (Anonymized)
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => handleExport(false)}
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text hover:bg-slate-50 disabled:opacity-50"
            >
              Export (Full)
            </button>
          </div>
        </div>

        {error && <InlineFormError message={error} />}

        <form onSubmit={handleCreate} className="rounded-xl border border-border bg-surface p-4 mb-6 grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Hospital name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="min-h-10 rounded-lg border border-border px-3 text-sm"
          />
          <input
            required
            placeholder="Code (e.g. BNK)"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            className="min-h-10 rounded-lg border border-border px-3 text-sm uppercase"
          />
          <input
            required
            placeholder="District"
            value={form.district}
            onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
            className="min-h-10 rounded-lg border border-border px-3 text-sm"
          />
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="min-h-10 rounded-lg border border-border px-3 text-sm"
          >
            <option value="primary_site">Primary Site</option>
            <option value="pilot_site">Pilot Site</option>
          </select>
          <input
            placeholder="Emergency phone"
            value={form.emergencyPhone}
            onChange={(e) => setForm((f) => ({ ...f, emergencyPhone: e.target.value }))}
            className="min-h-10 rounded-lg border border-border px-3 text-sm col-span-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="col-span-2 min-h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? 'Adding…' : 'Add Hospital'}
          </button>
        </form>

        {loading ? (
          <div className="py-12 text-center text-sm text-text-muted">Loading…</div>
        ) : (
          <div className="space-y-2">
            {hospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} onToggleActive={() => handleToggleActive(h)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
