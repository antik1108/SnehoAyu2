import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchHospitals, createHospital, updateHospital, downloadExport } from '../../features/admin/api';
import type { Hospital } from '../../features/admin/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';
import { ROUTES } from '../../routes/paths';

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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <Link to={ROUTES.ADMIN_PARTICIPANTS} className="text-sm font-semibold text-primary">
          ← Back to participants
        </Link>

        <div className="flex items-center justify-between mt-2 mb-6">
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
              <div key={h.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                <div>
                  <p className="text-sm font-semibold text-text">{h.name} ({h.code})</p>
                  <p className="text-xs text-text-muted">{h.district} · {h.emergencyPhone ?? 'No emergency phone set'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleActive(h)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${h.isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'}`}
                >
                  {h.isActive ? 'Enrolling' : 'Closed'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
