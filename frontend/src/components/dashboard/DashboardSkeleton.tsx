import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="h-24 rounded-2xl border border-border bg-surface" />
      <div className="h-32 rounded-2xl border border-border bg-surface" />
      <div className="h-20 rounded-2xl border border-border bg-surface" />
      <div className="h-20 rounded-2xl border border-border bg-surface" />
      <div className="h-20 rounded-2xl border border-border bg-surface" />
    </div>
  );
};
