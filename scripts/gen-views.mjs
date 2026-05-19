import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const analyticsHtml = readFileSync(
  'c:/Users/nirn/Downloads/ניתוח מענים (משימות) ינואר -מאי 26.html',
  'utf8'
);

mkdirSync(join(root, 'src/views'), { recursive: true });

const analyticsImports = `import React, { useState } from 'react';
import {
  BarChart, Bar, ScatterChart, Scatter, ReferenceLine, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, Line, ComposedChart, Legend,
} from 'recharts';
import { mainCategoryData, subCategoryData, COLORS, LABELS } from '../data.js';
import { getHeatmapBg } from '../utils.js';
import { getIntensityClassification } from '../utils/intensity.js';
import { CustomTooltipMain, CustomTooltipSub, CustomTooltipScatter } from '../components/Tooltips.jsx';
import { CustomTooltipComposed } from '../components/CustomTooltipComposed.jsx';
import { renderCustomBadgeLabel } from '../components/BadgeLabel.jsx';
import Interactive3DChart from '../components/Interactive3DChart.jsx';

function renderDualCell(fam, task) {
  if (!fam && !task) return <span className="text-slate-300">-</span>;
  return (
    <div className="flex items-center justify-center gap-0.5 dir-ltr flex-row-reverse">
      <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-l-md px-2 py-1 min-w-[36px]">
        <span className="text-[9px] text-slate-400 font-bold mb-0.5">משפחות</span>
        <span className="text-sm font-bold text-slate-700 leading-none">{fam || 0}</span>
      </motionless>
    </motionless>
  );
}

export default function AnalyticsView() {
`;

// Extract App function body from HTML - between "export default function App" and final closing
const appStart = analyticsHtml.indexOf('export default function App()');
const appBodyStart = analyticsHtml.indexOf('{', appStart) + 1;
// Find matching end - use last "}\n" before Interactive3DChart or before script end
const legendStart = analyticsHtml.indexOf('{/* Modern Floating Legend */}');
const appCore = analyticsHtml.slice(appBodyStart, legendStart);

let body = appCore
  .replace(/const \[activeMainTab, setActiveMainTab\] = useState\('continuity'\)/, "const [activeMainTab, setActiveMainTab] = useState('intensity')")
  .replace(/activeMainTab === 'continuity'/g, "activeMainTab === 'intensity'")
  .replace(/\(\) => setActiveMainTab\('continuity'\)/g, "() => setActiveMainTab('intensity')")
  .replace(/const getIntensityClassification[\s\S]*?};\n\nconst CustomTooltipComposed[\s\S]*?};\n\nconst CustomTooltipMain[\s\S]*?};\n\nconst CustomTooltipScatter[\s\S]*?};\n\n\/\/ --- Beautiful Badge[\s\S]*?};\n\nconst Interactive3DChart[\s\S]*?};\n\n/, '')
  .replace(/const filteredSubCategoryData[\s\S]*?};\n\n  const trendChartData[\s\S]*?} : \[\];\n\n  const totalFamiliesSelected[\s\S]*?;\n\n  \/\/ Helper renderer[\s\S]*?};\n\n  return \(/, `const filteredSubCategoryData = subCategoryData.filter(item => {
    const matchesSearch = item.sub.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = categoryFilter === LABELS.all || item.main === categoryFilter;
    return matchesSearch && matchesFilter;
  });

  const trendChartData = selectedSubCategory ? [
    { month: LABELS.months[0], fam: selectedSubCategory.janF, tasks: selectedSubCategory.janT },
    { month: LABELS.months[1], fam: selectedSubCategory.febF, tasks: selectedSubCategory.febT },
    { month: LABELS.months[2], fam: selectedSubCategory.marF, tasks: selectedSubCategory.marT },
    { month: LABELS.months[3], fam: selectedSubCategory.aprF, tasks: selectedSubCategory.aprT },
  ] : [];

  const totalFamiliesSelected = trendChartData.reduce((acc, curr) => acc + curr.fam, 0);
  const totalTasksSelected = trendChartData.reduce((acc, curr) => acc + curr.tasks, 0);
  const intensityData = getIntensityClassification(totalFamiliesSelected, totalTasksSelected);

  function renderDualCell(fam, task) {
    if (!fam && !task) return <span className="text-slate-300">-</span>;
    return (
      <div className="flex items-center justify-center gap-0.5 dir-ltr flex-row-reverse">
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-l-md px-2 py-1 min-w-[36px]">
          <span className="text-[9px] text-slate-400 font-bold mb-0.5">משפחות</span>
          <span className="text-sm font-bold text-slate-700 leading-none">{fam || 0}</span>
        </div>
        <motionless
`);

writeFileSync(join(root, 'src/views/_analytics_raw.txt'), body.slice(0, 5000));
