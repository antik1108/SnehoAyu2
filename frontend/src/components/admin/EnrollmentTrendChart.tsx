import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { EnrollmentTrendData } from '../../features/admin/analyticsHooks';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs">
        <div className="font-extrabold text-[#111] mb-1.5">{label}</div>
        <div className="flex items-center gap-2 font-semibold text-teal-700">
          <span className="h-2 w-2 rounded-full bg-teal-600" />
          Cumulative: <span className="font-extrabold">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const EnrollmentTrendChart: React.FC<{
  data?: EnrollmentTrendData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />;
  }

  const weeks = data?.weeks ?? [];
  const target = data?.target ?? 272;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-sans text-sm font-extrabold text-text-main">Enrollment Cumulative Trend</h3>
          <p className="text-[11px] font-medium text-text-muted">Weekly cumulative cohort enrollment progress</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
            <span className="text-text-main">Cumulative</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-rose-500 border-t border-dashed border-rose-500" />
            <span className="text-text-muted">Target ({target})</span>
          </div>
        </div>
      </div>

      {weeks.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-xs font-medium text-text-muted">
          No enrollment trend data available for current filter.
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeks} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="weekStart"
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }}
              />
              <YAxis
                domain={[0, Math.max(target + 10, ...weeks.map((w) => w.cumulative + 10))]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={target} label={{ value: `Target ${target}`, fill: '#f43f5e', fontSize: 9, fontWeight: 700, position: 'top' }} stroke="#f43f5e" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#0f766e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCumulative)"
                activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
