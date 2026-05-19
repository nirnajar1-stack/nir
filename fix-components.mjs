import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

// Interactive3DChart
let chart = fs.readFileSync(path.join(root, 'src/components/Interactive3DChart.jsx'), 'utf8');
if (!chart.includes('LABELS')) {
  chart = chart.replace(
    "import { COLORS, subCategoryData } from '../data.js';",
    "import { COLORS, subCategoryData, LABELS } from '../data.js';"
  );
}
const cLines = chart.split('\n');
for (let i = 0; i < cLines.length; i++) {
  if (cLines[i].includes('text-lg') && cLines[i].includes('<p')) {
    cLines[i] = '          <p className="text-lg">{LABELS.loading3d}</p>';
  }
  if (cLines[i].includes('lbl.sla') && cLines[i].includes('lbl.families')) {
    cLines[i] = "                {lbl.sla} {LABELS.dayShort} | {lbl.families} {LABELS.familiesShort}";
  }
  if (cLines[i].includes('font-bold text-slate-200') && cLines[i].includes('border-b')) {
    cLines[i] = '        <motion.div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{LABELS.axisLegendTitle}</motion.div>'.replace('motion.div', 'div');
  }
  if (cLines[i].includes('bg-red-500') && i > 0 && cLines[i - 1].includes('flex items-center')) {
    cLines[i + 1] = '          <span>{LABELS.axisX}</span>';
    if (cLines[i + 3]) cLines[i + 3] = '          <span>{LABELS.axisY}</span>';
    if (cLines[i + 5]) cLines[i + 5] = '          <span>{LABELS.axisZ}</span>';
  }
  if (cLines[i].trim().startsWith('* ')) {
    cLines[i] = '          {LABELS.axisHint}';
  }
  if (cLines[i].includes('(X):')) cLines[i] = '              <span>{LABELS.hoverX}</span>';
  if (cLines[i].includes('(Y):')) cLines[i] = '              <span>{LABELS.hoverY}</span>';
  if (cLines[i].includes('(Z):')) cLines[i] = '              <span>{LABELS.hoverZ}</span>';
  if (cLines[i].includes('hoveredPoint.families}') && cLines[i].includes('span')) {
    cLines[i] = '              <span className="font-bold text-slate-200">{hoveredPoint.families} {LABELS.families}</span>';
  }
  if (cLines[i].includes('hoveredPoint.sla}') && cLines[i].includes('font-bold')) {
    cLines[i] = '              <span className="font-bold text-slate-200">{hoveredPoint.sla} {LABELS.days}</span>';
  }
  if (cLines[i].includes('hoveredPoint.tasks}') && cLines[i].includes('font-bold')) {
    cLines[i] = '              <span className="font-bold text-slate-200">{hoveredPoint.tasks} {LABELS.inquiries}</span>';
  }
}
chart = cLines.join('\n').replace(/motion\.div/g, 'motion.div');
chart = chart.replace(/<div className="font-bold text-slate-200 border-b[^>]+>\{LABELS\.axisLegendTitle\}<\/div>/, '<div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{LABELS.axisLegendTitle}</div>');
fs.writeFileSync(path.join(root, 'src/components/Interactive3DChart.jsx'), chart, 'utf8');

// BadgeLabel
let badge = fs.readFileSync(path.join(root, 'src/components/BadgeLabel.jsx'), 'utf8');
if (!badge.includes('LABELS')) {
  badge = "import { LABELS } from '../data.js';\n" + badge;
}
badge = badge.replace(/\{sla\} [^|]+\| \{families\} [^<']+/, '{sla} {LABELS.days} | {families} {LABELS.familiesShort}');
fs.writeFileSync(path.join(root, 'src/components/BadgeLabel.jsx'), badge, 'utf8');

console.log('components fixed');
