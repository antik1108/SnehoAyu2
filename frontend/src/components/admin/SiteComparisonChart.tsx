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

export const SiteComparisonChart: React.FC<{
  data?: SiteComparisonData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />;
  }

  const sites = data?.sites ?? [];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
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
            <BarChart data={sites} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="hospitalName" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="studyCount" name="Study Group" fill="#0f766e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="controlCount" name="Control Group" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
