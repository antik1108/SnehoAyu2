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
    <div className="interactive-card flex items-center justify-between gap-4 rounded-2xl border border-[#e693c5] bg-[#efa8d0] p-5 text-[#181715] lg:col-span-5">
      <div>
        <p className="text-xs font-extrabold uppercase text-[#181715]/62">{label}</p>
        <p className="mt-3 text-4xl font-extrabold leading-none">{safePercent}%</p>
        <p className="mt-2 text-sm font-bold text-[#181715]/70">
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
        <circle cx="56" cy="56" r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/35" />
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
          className="text-[#111]"
          transform="rotate(-90 56 56)"
        />
        <text x="56" y="52" textAnchor="middle" className="fill-[#181715] text-[18px] font-bold">
          {safePercent}%
        </text>
        <text x="56" y="70" textAnchor="middle" className="fill-[#181715]/70 text-[9px] font-bold">
          {completedCount}/{totalCount}
        </text>
      </svg>
    </div>
  );
};
