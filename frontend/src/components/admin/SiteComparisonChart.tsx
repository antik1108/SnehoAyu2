import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SiteComparisonData } from '../../features/admin/analyticsHooks';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs space-y-1.5">
        <div className="font-extrabold text-[#111] mb-1">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 font-semibold" style={{ color: entry.fill }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
            {entry.name}: <span className="font-extrabold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SiteComparisonChart: React.FC<{
  data?: SiteComparisonData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />;
  }

  const sites = data?.sites ?? [];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="mb-4">
        <h3 className="font-sans text-sm font-extrabold text-text-main">Site Comparison</h3>
        <p className="text-[11px] font-medium text-text-muted">Enrollment counts by study group per site</p>
      </div>

      {sites.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-xs font-medium text-text-muted">
          No site comparison data available.
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sites} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="hospitalName" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '12px', fontWeight: 600 }} />
              <Bar dataKey="studyCount" name="Study Group" fill="#0f766e" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="controlCount" name="Control Group" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
