import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface OverdueParticipant {
  id: string;
  participantCode: string;
  hospitalName: string;
  overdueCheckpoints: string[];
}

export const OverdueCheckpointList: React.FC<{
  overdueParticipants?: OverdueParticipant[];
  isLoading: boolean;
}> = ({ overdueParticipants = [], isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <div className="mb-6 h-12 animate-pulse rounded-2xl bg-neutral-200/60" />;
  }

  const count = overdueParticipants.length;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              Overdue Checkpoint Attention List ({count})
            </div>
            <div className="text-[11px] font-medium text-amber-700">
              {count > 0
                ? `${count} participant(s) require follow-up assessment collection`
                : 'No overdue checkpoints across the active filter cohort'}
            </div>
          </div>
        </div>

        {count > 0 && (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-800">
            <span>{isOpen ? 'Collapse' : 'Expand list'}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        )}
      </button>

      {isOpen && count > 0 && (
        <div className="border-t border-amber-200/80 px-5 py-4">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {overdueParticipants.map((p) => (
              <Link
                key={p.id}
                to={`/admin/participants/${p.id}`}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-white p-3 shadow-xs transition-colors hover:bg-amber-50"
              >
                <div>
                  <div className="font-technical text-xs font-bold text-primary">
                    {p.participantCode}
                  </div>
                  <div className="text-[11px] font-medium text-text-muted">{p.hospitalName}</div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {p.overdueCheckpoints.map((cp) => (
                    <span
                      key={cp}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800"
                    >
                      <Clock className="h-3 w-3" />
                      {cp}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
