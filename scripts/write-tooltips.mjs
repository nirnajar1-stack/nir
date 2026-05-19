import { writeFileSync } from 'fs';

writeFileSync(
  'src/components/Tooltips.jsx',
  `import React from 'react';
import { COLORS, LABELS } from '../data.js';

const tooltipBase = 'bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl text-right';

export const CustomTooltipMain = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className={\`\${tooltipBase} min-w-[180px]\`} dir="rtl">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <motionless
`
);
