import React, { useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerCrash, CheckCircle2 } from 'lucide-react';
import { getServerDown, subscribeServerStatus, setServerDown } from '../lib/serverStatus';
import { ROUTES } from '../routes/paths';

const HEALTH_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api') + '/health';
const POLL_INTERVAL_MS = 5000;

/**
 * App-wide "the backend is unreachable" overlay. Mounted once at the root
 * so a server crash/restart shows one calm, consistent message instead of
 * every page independently rendering its own "Something went wrong" error.
 * Polls the health endpoint in the background and auto-recovers — no user
 * action needed once the server comes back.
 */
export const ServerDownOverlay: React.FC = () => {
  const isDown = useSyncExternalStore(subscribeServerStatus, getServerDown);
  const [justRecovered, setJustRecovered] = useState(false);
  const navigate = useNavigate();
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isDown) return;

    const poll = async () => {
      try {
        const res = await fetch(HEALTH_URL, { cache: 'no-store' });
        if (res.ok) {
          setServerDown(false);
          setJustRecovered(true);
          navigate(ROUTES.ROOT, { replace: true });
          window.setTimeout(() => setJustRecovered(false), 2000);
        }
      } catch {
        // still down — keep polling
      }
    };

    pollRef.current = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    void poll(); // try immediately too, don't wait for the first interval

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [isDown, navigate]);

  if (!isDown && !justRecovered) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="mx-4 flex max-w-sm flex-col items-center rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
        {justRecovered ? (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-text">We're back!</h2>
            <p className="mt-1 text-sm text-text-muted">Taking you home now.</p>
          </>
        ) : (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ServerCrash className="h-7 w-7 animate-pulse" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-text">We'll be right back</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              We're updating our server. This page will continue automatically
              as soon as we're back — no need to do anything.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Reconnecting…
            </div>
          </>
        )}
      </div>
    </div>
  );
};
