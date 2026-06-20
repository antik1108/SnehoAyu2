import React, { useEffect, useState } from 'react';
import { Video } from 'lucide-react';
import { getActiveTelehealthSession, type ActiveTelehealthSession } from '../../features/telehealth/api';

export const TelehealthCard: React.FC = () => {
  const [session, setSession] = useState<ActiveTelehealthSession | null>(null);

  useEffect(() => {
    getActiveTelehealthSession().then(setSession).catch(() => undefined);
  }, []);

  if (!session) return null;

  return (
    <div className="rounded-xl border border-teal-300 bg-teal-50 p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-teal-900">Video call scheduled</p>
        <p className="text-xs text-teal-700">
          {session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : 'Researcher will call you on WhatsApp'}
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <Video className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  );
};
