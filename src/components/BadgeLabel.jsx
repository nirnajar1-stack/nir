import React from 'react';
import { LABELS } from '../data.js';

function shortSubLabel(sub) {
  const parts = sub.trim().split(/\s+/);
  return parts.length > 2 ? `${parts[0]} ${parts[1]}` : sub;
}

export function renderCustomBadgeLabel(props) {
  const { cx, cy, families, sla, sub } = props;
  if (families > 36 && sla > 22) {
    return (
      <foreignObject x={cx - 70} y={cy - 26} width={140} height={52} className="overflow-visible pointer-events-none">
        <div className="flex flex-col items-center justify-center w-full h-full drop-shadow-md">
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm border border-white/50 px-2 py-0.5 rounded-t-lg shadow-sm w-max max-w-[130px]">
            <span className="text-on-surface text-[10px] font-extrabold tracking-wide truncate block text-center" title={sub}>
              {shortSubLabel(sub)}
            </span>
          </div>
          <div className="bg-inverse-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-b-lg shadow-sm border-t border-outline-variant/40 w-max whitespace-nowrap">
            <span className="text-on-primary text-[9px] font-medium tracking-wide">
              {sla} {LABELS.days} | {families} {LABELS.familiesShort}
            </span>
          </div>
        </div>
      </foreignObject>
    );
  }

  if (families > 24 || sla > 22) {
    return (
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize="10"
        fontWeight="bold"
        opacity="0.92"
        style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.85)' }}
      >
        {shortSubLabel(sub)}
      </text>
    );
  }
  return null;
}
