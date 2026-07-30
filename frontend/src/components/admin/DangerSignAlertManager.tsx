import React, { useState } from 'react';
import { DangerSignAlertItem } from '../../features/admin/types';
import api from '../../lib/api';
import { CheckCircle, Clock } from 'lucide-react';
import { InlineFormError } from '../feedback/InlineFormError';

export const DangerSignAlertManager: React.FC<{
  alerts?: DangerSignAlertItem[];
  onRefresh?: () => void;
}> = ({ alerts = [], onRefresh }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (alertId: string, action: 'acknowledge' | 'resolve') => {
    setUpdatingId(alertId);
    setError(null);
    try {
      await api.post(`/admin/danger-signs/${alertId}/${action}`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${action} alert`);
    } finally {
      setUpdatingId(null);
    }
  };

  const openAlerts = alerts.filter((a) => a.status === 'OPEN');
  const ackAlerts = alerts.filter((a) => a.status === 'ACKNOWLEDGED');

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-sans text-sm font-extrabold text-text-main">Danger Sign Alert History</h3>
          <p className="text-[11px] font-medium text-text-muted">
            Clinical alert tracking, acknowledgments, and resolutions
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-800">
            {openAlerts.length} Open
          </span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
            {ackAlerts.length} Acknowledged
          </span>
        </div>
      </div>

      {error && <InlineFormError message={error} />}

      {alerts.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-text-muted">
          No danger sign alerts recorded for this participant.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isOpen = alert.status === 'OPEN';
            const isAck = alert.status === 'ACKNOWLEDGED';
            const isBusy = updatingId === alert.id;

            let borderStyle = 'border-neutral-200 bg-neutral-50/50';
            if (isOpen) borderStyle = 'border-red-300 bg-red-50/40';
            else if (isAck) borderStyle = 'border-amber-300 bg-amber-50/40';

            return (
              <div
                key={alert.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 ${borderStyle}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-text-main">
                      {alert.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        isOpen
                          ? 'bg-red-100 text-red-800'
                          : isAck
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-text-muted">
                    Raised: {new Date(alert.raisedAt).toLocaleString()}
                  </div>
                  {(alert.notes || alert.description) && (
                    <div className="mt-1 text-xs font-medium text-text-main">
                      {alert.notes || alert.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isOpen && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStatusChange(alert.id, 'acknowledge')}
                      className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-200 disabled:opacity-50"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Acknowledge
                    </button>
                  )}

                  {(isOpen || isAck) && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleStatusChange(alert.id, 'resolve')}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  )}

                  {alert.status === 'RESOLVED' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle className="h-4 w-4" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
