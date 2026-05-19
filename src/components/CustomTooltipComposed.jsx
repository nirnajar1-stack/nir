import React from 'react';
import { LABELS } from '../data.js';

export function CustomTooltipComposed({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const families = payload.find((p) => p.dataKey === 'fam')?.value || 0;
  const tasks = payload.find((p) => p.dataKey === 'tasks')?.value || 0;

  return (
    <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl text-right min-w-[180px]" dir="rtl">
      <div className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">{label}</div>
      <div className="text-sm text-slate-600 mb-1 flex justify-between gap-4">
        <span>תפוצה ({LABELS.families}):</span>
        <span className="font-bold text-slate-800">{families}</span>
      </div>
      <div className="text-sm text-slate-600 mb-2 flex justify-between gap-4">
        <span>עומס ({LABELS.tasks}):</span>
        <span className="font-bold text-slate-800">{tasks}</span>
      </div>
      <div className="bg-slate-50 p-2 rounded-lg mt-2 text-xs text-center font-semibold text-slate-600 border border-slate-100">
        יחס עצימות: {families > 0 ? (tasks / families).toFixed(2) : 0} משימות למשפחה
      </div>
    </div>
  );
}
