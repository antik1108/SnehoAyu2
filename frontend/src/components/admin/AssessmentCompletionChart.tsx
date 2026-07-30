import React, { useMemo } from 'react';
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
import { AssessmentCompletionData } from '../../features/admin/analyticsHooks';

const INSTRUMENT_COLORS: Record<string, string> = {
  knowledge_mcq: '#0f766e',
  who5: '#2563eb',
  psoc: '#7c3aed',
  tdsc: '#d97706',
  breastfeeding: '#ec4899',
};

const INSTRUMENT_LABELS: Record<string, string> = {
  knowledge_mcq: 'Knowledge MCQ',
  who5: 'WHO-5',
  psoc: 'PSOC',
  tdsc: 'TDSC',
  breastfeeding: 'Breastfeeding',
};

export const AssessmentCompletionChart: React.FC<{
  data?: AssessmentCompletionData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    const rates = data?.rates ?? [];
    const checkpoints = ['baseline', '1_month', '3_month', '6_month'];

    return checkpoints.map((cp) => {
      const row: Record<string, any> = { checkpoint: cp };
      rates
        .filter((r) => r.checkpoint === cp)
        .forEach((r) => {
          row[r.instrument] = r.pct;
        });
      return row;
    });
  }, [data]);

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />;
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-sans text-sm font-extrabold text-text-main">Assessment Completion Rates</h3>
        <p className="text-[11px] font-medium text-text-muted">Completion % across instruments by checkpoint</p>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="checkpoint" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val}%`, 'Completion']}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            {Object.keys(INSTRUMENT_COLORS).map((inst) => (
              <Bar
                key={inst}
                dataKey={inst}
                name={INSTRUMENT_LABELS[inst]}
                fill={INSTRUMENT_COLORS[inst]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
