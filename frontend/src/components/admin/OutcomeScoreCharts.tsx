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
import { OutcomeScoresData, OutcomeScoreDataPoint } from '../../features/admin/analyticsHooks';
import { Info } from 'lucide-react';

interface SingleOutcomeChartProps {
  title: string;
  subtitle: string;
  unit?: string;
  dataPoints: OutcomeScoreDataPoint[];
  color: string;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs leading-relaxed">
        <div className="font-extrabold text-[#111] mb-1 capitalize">{label}</div>
        {data.sparse ? (
          <div className="font-semibold text-amber-700">
            Fewer than 5 responses — interpret with caution (n={data.n})
          </div>
        ) : (
          <div className="font-semibold text-[#111]">
            Mean Score: <span className="text-teal-700 font-extrabold">{data.studyMean}{unit}</span> (n={data.n})
          </div>
        )}
      </div>
    );
  }
  return null;
};

const SingleOutcomeChart: React.FC<SingleOutcomeChartProps> = ({
  title,
  subtitle,
  unit = '',
  dataPoints,
  color,
}) => {
  const chartData = dataPoints.map((dp) => ({
    checkpoint: dp.checkpoint,
    studyMean: dp.study.mean,
    n: dp.study.n,
    sparse: dp.study.sparse ?? false,
  }));

  const hasSparsePoints = dataPoints.some((dp) => dp.study.sparse);

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="font-sans text-xs font-extrabold text-text-main">{title}</h4>
          <p className="text-[10px] font-medium text-text-muted">{subtitle}</p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-neutral-600">
          Study group
        </span>
      </div>

      <div className="mb-2 flex items-center justify-between text-[10px] text-text-muted">
        <span className="flex items-center gap-1 font-medium">
          <Info className="h-3.5 w-3.5 text-text-muted/70" />
          Control group data is not available
        </span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="checkpoint" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 500 }} unit={unit} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line
              type="monotone"
              dataKey="studyMean"
              stroke={color}
              strokeWidth={2}
              connectNulls
              activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 1.5 }}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.sparse) {
                  return (
                    <circle cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} key={props.key} />
                  );
                }
                return <circle cx={cx} cy={cy} r={4} fill={color} key={props.key} />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {hasSparsePoints && (
        <div className="mt-2 text-[10px] font-semibold text-amber-700">
          * Data points with fewer than 5 responses are flagged for caution
        </div>
      )}
    </div>
  );
};

export const OutcomeScoreCharts: React.FC<{
  data?: OutcomeScoresData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-3">
        <h3 className="font-sans text-sm font-extrabold text-text-main">Longitudinal Outcome Scores</h3>
        <p className="text-[11px] font-medium text-text-muted">
          Cohort outcome scores across WHO-5, PSOC, and Knowledge MCQ instruments
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SingleOutcomeChart
          title="WHO-5 Well-being"
          subtitle="Mean % score (higher = better wellbeing)"
          unit="%"
          dataPoints={data?.who5 ?? []}
          color="#0f766e"
        />
        <SingleOutcomeChart
          title="PSOC Parenting Efficacy"
          subtitle="Mean total score"
          dataPoints={data?.psoc ?? []}
          color="#6366f1"
        />
        <SingleOutcomeChart
          title="Knowledge MCQ"
          subtitle="Mean raw score"
          dataPoints={data?.knowledge ?? []}
          color="#9333ea"
        />
      </div>
    </div>
  );
};
