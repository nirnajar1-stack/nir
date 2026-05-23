import React from 'react';
import { LABELS } from '../data.js';

export function CustomTooltipComposed({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const families = payload.find((p) => p.dataKey === 'fam')?.value || 0;
  const tasks = payload.find((p) => p.dataKey === 'tasks')?.value || 0;

  return (
    <div className="bg-surface-container-lowest/95 backdrop-blur-md p-4 border border-outline-variant/15 shadow-xl rounded-none text-right min-w-[180px]" dir="rtl">
      <div className="font-bold text-on-surface mb-2 border-b border-outline-variant/15 pb-2">{label}</div>
      <div className="text-sm text-on-surface-variant mb-1 flex justify-between gap-4">
        <span>{LABELS.spreadUniqueFamilies}:</span>
        <span className="font-bold text-on-surface">{families}</span>
      </div>
      <div className="text-sm text-on-surface-variant mb-2 flex justify-between gap-4">
        <span>{LABELS.tasks}:</span>
        <span className="font-bold text-on-surface">{tasks}</span>
      </div>
      <div className="bg-surface-container-low p-2 rounded-none mt-2 text-xs text-center font-semibold text-on-surface-variant border border-outline-variant/15">
        {LABELS.tooltipIntensityRatio}: {families > 0 ? (tasks / families).toFixed(2) : 0} משימות למשפחה ייחודית
      </div>
    </div>
  );
}
