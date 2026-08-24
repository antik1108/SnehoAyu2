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
  who5: '#4f46e5',
  psoc: '#9333ea',
  tdsc: '#e11d48',
  breastfeeding: '#ec4899',
};

const INSTRUMENT_LABELS: Record<string, string> = {
  knowledge_mcq: 'Knowledge MCQ',
  who5: 'WHO-5 Well-being',
  psoc: 'PSOC Parenting Efficacy',
  tdsc: 'TDSC Tracker',
  breastfeeding: 'Breastfeeding Support',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs space-y-1.5">
        <div className="font-extrabold text-[#111] mb-1 capitalize">{label.replace('_', ' ')}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 font-semibold" style={{ color: entry.fill }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
            {entry.name}: <span className="font-extrabold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
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
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="mb-4">
        <h3 className="font-sans text-sm font-extrabold text-text-main">Assessment Completion Rates</h3>
        <p className="text-[11px] font-medium text-text-muted">Completion % across instruments by checkpoint</p>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="checkpoint" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '12px', fontWeight: 600 }} />
            {Object.keys(INSTRUMENT_COLORS).map((inst) => (
              <Bar
                key={inst}
                dataKey={inst}
                name={INSTRUMENT_LABELS[inst]}
                fill={INSTRUMENT_COLORS[inst]}
                radius={[5, 5, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
