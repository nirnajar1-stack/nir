import React from 'react';
import { COLORS, LABELS } from '../data.js';

const tooltipBase = 'bg-surface-container-lowest/95 backdrop-blur-md p-4 border border-outline-variant/15 shadow-xl rounded-none text-right';

export const CustomTooltipMain = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className={`${tooltipBase} min-w-[180px]`} dir="rtl">
      <div className="flex items-center gap-2 mb-3 border-b border-outline-variant/15 pb-2">
        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[data.category] }} />
        <p className="font-bold text-on-surface">{data.category}</p>
      </div>
      <p className="text-sm text-on-surface-variant mb-1 flex justify-between gap-4">
        <span>{LABELS.tooltipFamilies}:</span>
        <span className="font-bold text-on-surface">{data.families}</span>
      </p>
      <p className="text-sm text-on-surface-variant flex justify-between gap-4">
        <span>זמן טיפול ממוצע:</span>
        <span className="font-bold text-on-surface">{data.avgSla} ימ׳</span>
      </p>
    </div>
  );
};

export const CustomTooltipSub = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className={`${tooltipBase} min-w-[200px]`} dir="rtl">
      <p className="font-bold text-on-surface mb-1">{data.sub}</p>
      <p className="text-xs text-on-surface-variant font-medium mb-3 border-b border-outline-variant/15 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[data.main] }} />
        {data.main}
      </p>
      <p className="text-sm text-on-surface-variant mb-1 flex justify-between gap-4">
        <span>{LABELS.spreadUniqueFamilies}:</span>
        <span className="font-bold text-on-surface">{data.families}</span>
      </p>
      <p className="text-sm text-on-surface-variant mb-1 flex justify-between gap-4">
        <span>מאמץ (SLA):</span>
        <span className="font-bold text-on-surface">{data.sla} ימים</span>
      </p>
      {data.tasks != null && (
        <p className="text-sm text-on-surface-variant flex justify-between gap-4">
          <span>משימות:</span>
          <span className="font-bold text-on-surface">{data.tasks}</span>
        </p>
      )}
    </div>
  );
};

export const CustomTooltipScatter = CustomTooltipSub;
