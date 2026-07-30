import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import api from '../../lib/api';
import { GrowthReading, BabyProfile } from '../../features/admin/types';

export const GrowthChartAdmin: React.FC<{
  participantId: string;
  babyProfile?: BabyProfile | null;
}> = ({ participantId, babyProfile }) => {
  const { data: readings = [], isLoading } = useQuery({
    queryKey: ['admin', 'participant', participantId, 'growth'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: GrowthReading[] }>(
        `/admin/participants/${participantId}/growth`
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />;
  }

  // Synthesize single point for discharge weight if zero readings exist
  const chartData =
    readings.length > 0
      ? readings.map((r) => ({
          correctedAgeWeeks: r.correctedAgeWeeks,
          weightGrams: r.weightGrams,
          lengthCm: r.lengthCm,
          headCircumferenceCm: r.headCircumferenceCm,
          label: r.timePoint || r.source,
        }))
      : babyProfile?.weightAtDischargeGrams
      ? [
          {
            correctedAgeWeeks: 0,
            weightGrams: babyProfile.weightAtDischargeGrams,
            lengthCm: null,
            headCircumferenceCm: null,
            label: 'Discharge weight',
          },
        ]
      : [];

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-sans text-sm font-extrabold text-text-main">Baby Growth Trajectory</h3>
          <p className="text-[11px] font-medium text-text-muted">
            Weight, length, and head circumference plotted against corrected age (weeks)
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-xs font-medium text-text-muted">
          No growth readings recorded for this infant.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="correctedAgeWeeks"
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                label={{ value: 'Corrected Age (weeks)', position: 'bottom', offset: -5, fontSize: 10 }}
              />
              <YAxis
                yAxisId="weight"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                unit="g"
              />
              <YAxis
                yAxisId="length"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                unit="cm"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weightGrams"
                name="Weight (g)"
                stroke="#0f766e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0f766e' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="length"
                type="monotone"
                dataKey="lengthCm"
                name="Length (cm)"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3, fill: '#2563eb' }}
              />
              <Line
                yAxisId="length"
                type="monotone"
                dataKey="headCircumferenceCm"
                name="Head Circ (cm)"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ r: 3, fill: '#7c3aed' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
