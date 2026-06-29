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
    <div className="interactive-card flex items-center justify-between rounded-2xl border border-[#9bb6df] bg-[#aac3e9] p-5 text-[#181715] lg:col-span-12">
      <div>
        <p className="text-sm font-extrabold">Video call scheduled</p>
        <p className="text-xs font-bold text-[#181715]/70">
          {session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : 'Researcher will call you on WhatsApp'}
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/32">
        <Video className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  );
};
