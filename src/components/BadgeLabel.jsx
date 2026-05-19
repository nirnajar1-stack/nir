import React from 'react';
import { LABELS } from '../data.js';

export function renderCustomBadgeLabel(props) {
  const { cx, cy, families, sla, sub } = props;
  if (families > 30 && sla > 19) {
    return (
      <foreignObject x={cx - 75} y={cy - 22} width={150} height={44} className="overflow-visible pointer-events-none">
        <div className="flex flex-col items-center justify-center w-full h-full drop-shadow-md">
          <div className="bg-white/85 backdrop-blur-sm border border-white/50 px-3 py-0.5 rounded-t-lg shadow-sm w-max max-w-full">
            <span className="text-slate-800 text-[11px] font-extrabold tracking-wide truncate block text-center">
              {sub}
            </span>
          </div>
          <div className="bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded-b-lg shadow-sm border-t border-slate-700 w-max">
            <span className="text-white text-[10px] font-medium tracking-wide">
              {sla} {LABELS.days} | {families} {LABELS.familiesShort}
            </span>
          </div>
        </div>
      </foreignObject>
    );
  }
  
  if (families > 20 || sla > 20) {
      return (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="12" fontWeight="bold" opacity="0.9" style={{textShadow: '0px 1px 2px rgba(0,0,0,0.8)'}}>
              {sub.split(' ')[0]}
          </text>
      )
  }
  return null;
};