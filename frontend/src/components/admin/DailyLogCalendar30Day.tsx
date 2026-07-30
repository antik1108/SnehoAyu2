import React from 'react';
import { DailyLog30DayItem } from '../../features/admin/types';

export const DailyLogCalendar30Day: React.FC<{ dailyLogs?: DailyLog30DayItem[] }> = ({
  dailyLogs = [],
}) => {
  // Generate 30 days array up to today
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = dailyLogs.find((l) => l.careDate === dateStr);
    return {
      dateStr,
      dayNum: d.getDate(),
      monthLabel: d.toLocaleDateString('en-US', { month: 'short' }),
      log: log ?? { careDate: dateStr, hasLog: false, completedCount: 0, dangerSignsReviewed: false },
    };
  });

  const activeDays = dailyLogs.filter((l) => l.completedCount >= 5).length;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-sans text-sm font-extrabold text-text-main">30-Day Care Task Calendar</h3>
          <p className="text-[11px] font-medium text-text-muted">
            Daily engagement history (active = &ge;5 completed care tasks)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800">
            {activeDays}/30 Active Days
          </span>
        </div>
      </div>

      {/* Grid of 30 days */}
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
        {days.map((item) => {
          const count = item.log.completedCount;
          let cellStyle = 'bg-neutral-50 border-dashed border-neutral-200 text-neutral-400';

          if (count >= 5) {
            cellStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
          } else if (count >= 1) {
            cellStyle = 'bg-yellow-50 border-yellow-200 text-yellow-800 font-semibold';
          }

          return (
            <div
              key={item.dateStr}
              title={`${item.dateStr}: ${count} tasks completed ${
                item.log.dangerSignsReviewed ? '(Danger signs reviewed)' : ''
              }`}
              className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all hover:scale-105 ${cellStyle}`}
            >
              <span className="text-[9px] uppercase tracking-tighter text-text-muted">{item.monthLabel}</span>
              <span className="text-xs">{item.dayNum}</span>
              <span className="mt-0.5 text-[9px]">{count > 0 ? `${count} tasks` : 'No log'}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-300" />
          <span>Active (&ge;5 tasks)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-yellow-50 border border-yellow-200" />
          <span>Partial (1–4 tasks)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-neutral-50 border border-dashed border-neutral-200" />
          <span>No log (0 tasks)</span>
        </div>
      </div>
    </div>
  );
};
