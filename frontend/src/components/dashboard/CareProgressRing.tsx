import React from 'react';

interface CareProgressRingProps {
  percent: number;
  completedCount: number;
  totalCount: number;
  label: string;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export const CareProgressRing: React.FC<CareProgressRingProps> = ({ percent, completedCount, totalCount, label }) => {
  const safePercent = clampPercent(percent);
  const radius = 44;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        <p className="mt-1 text-sm text-text-muted">
          {completedCount}/{totalCount}
        </p>
      </div>
      <svg
        width="112"
        height="112"
        viewBox="0 0 112 112"
        role="img"
        aria-label={`${label} ${safePercent}% complete`}
        className="shrink-0"
      >
        <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary"
          transform="rotate(-90 56 56)"
        />
        <text x="56" y="52" textAnchor="middle" className="fill-text text-[18px] font-semibold">
          {safePercent}%
        </text>
        <text x="56" y="70" textAnchor="middle" className="fill-text-muted text-[9px] font-medium">
          {completedCount}/{totalCount}
        </text>
      </svg>
    </div>
  );
};
