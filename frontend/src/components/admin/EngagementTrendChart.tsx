import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { EngagementTrendData } from '../../features/admin/analyticsHooks';

export const EngagementTrendChart: React.FC<{
  data?: EngagementTrendData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />;
  }

  const weeks = data?.weeks ?? [];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans text-sm font-extrabold text-text-main">Weekly Mean Engagement Trend</h3>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Study group only
            </span>
          </div>
          <p className="text-[11px] font-medium text-text-muted">
            Mean % of active logging days (&ge;5 care tasks completed)
          </p>
        </div>
      </div>

      {weeks.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-xs font-medium text-text-muted">
          No Study-group data for the current filter
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeks} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="weekStart" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val}%`, 'Mean Engagement']}
              />
              <Line
                type="monotone"
                dataKey="meanEngagementPct"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#059669' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
