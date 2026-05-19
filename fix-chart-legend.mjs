import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const p = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/components/Interactive3DChart.jsx');
const lines = fs.readFileSync(p, 'utf8').split('\n');

const legendStart = lines.findIndex((l) => l.includes('absolute bottom-4 right-4'));
const legendEnd = lines.findIndex((l, i) => i > legendStart && l.trim() === '</div>' && lines[i + 1]?.includes('hoveredPoint'));

const legendBlock = `      <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl text-xs text-slate-300 space-y-1.5 border border-slate-800" dir="rtl">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{LABELS.axisLegendTitle}</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500"></div>
          <span>{LABELS.axisX}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span>{LABELS.axisY}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span>{LABELS.axisZ}</span>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1 font-medium">
          {LABELS.axisHint}
        </div>
      </div>`.split('\n');

if (legendStart >= 0 && legendEnd >= legendStart) {
  lines.splice(legendStart, legendEnd - legendStart + 1, ...legendBlock);
}

if (!lines.some((l) => l.includes('LABELS'))) {
  lines[1] = "import { COLORS, subCategoryData, LABELS } from '../data.js';";
}

fs.writeFileSync(p, lines.join('\n'), 'utf8');
console.log('chart legend fixed', legendStart, legendEnd);
