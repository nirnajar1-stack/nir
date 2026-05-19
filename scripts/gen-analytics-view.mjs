import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'src/views/_analytics_src.html'), 'utf8');

const navStart = html.indexOf('{/* --- Main Navigation Tabs --- */}');
const legendIdx = html.indexOf('{/* Modern Floating Legend */}');
let jsx = html.slice(navStart, legendIdx);

jsx = jsx
  .replace(/'continuity'/g, "'intensity'")
  .replace(/📉 תפוצה לעומת עצימות/g, '{LABELS.tabIntensity}')
  .replace(/🔎 טבלת פיזור מורחבת/g, '{LABELS.tabSpread}')
  .replace(/🧠 מטריצת החלטות \(2D\/3D\)/g, '{LABELS.tabMatrix}')
  .replace(/📊 פילוח כללי/g, '{LABELS.tabOverview}')
  .replace(/useState\('הכל'\)/g, 'useState(LABELS.all)')
  .replace(/categoryFilter === 'הכל'/g, 'categoryFilter === LABELS.all')
  .replace(/value="הכל"/g, 'value={LABELS.all}')
  .replace(/>כל הקטגוריות</g, '>{LABELS.allCategories}<')
  .replace(/placeholder="חפש משימה\.\.\."/g, 'placeholder={LABELS.searchPlaceholder}')
  .replace(/לא נמצאו משימות\./g, '{LABELS.noResults}')
  .replace(/לא נמצאו נתונים תואמים\./g, '{LABELS.noDataSpread}');

const header = `import React, { useState } from 'react';
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
      <motionless
`;

const logic = `
export default function AnalyticsView() {
  const [activeMainTab, setActiveMainTab] = useState('intensity');
  const [activeTab, setActiveTab] = useState('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryData[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(LABELS.all);

  const filteredSubCategoryData = subCategoryData.filter((item) => {
    const matchesSearch = item.sub.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = categoryFilter === LABELS.all || item.main === categoryFilter;
    return matchesSearch && matchesFilter;
  });

  const trendChartData = selectedSubCategory
    ? [
        { month: LABELS.months[0], fam: selectedSubCategory.janF, tasks: selectedSubCategory.janT },
        { month: LABELS.months[1], fam: selectedSubCategory.febF, tasks: selectedSubCategory.febT },
        { month: LABELS.months[2], fam: selectedSubCategory.marF, tasks: selectedSubCategory.marT },
        { month: LABELS.months[3], fam: selectedSubCategory.aprF, tasks: selectedSubCategory.aprT },
      ]
    : [];

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
        <div className="flex flex-col items-center bg-indigo-50 border border-indigo-100 rounded-r-md px-2 py-1 min-w-[36px]">
          <span className="text-[9px] text-indigo-400 font-bold mb-0.5">משימות</span>
          <span className="text-sm font-bold text-indigo-700 leading-none">{task || 0}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
`;

// Fix header typo - use char code for div in renderDualCell at top - actually remove broken header const
const D = String.fromCharCode(100, 105, 118);
const renderDualFn = `
function renderDualCell(fam, task) {
  if (!fam && !task) return <span className="text-slate-300">-</span>;
  return (
    <${D} className="flex items-center justify-center gap-0.5 dir-ltr flex-row-reverse">
      <${D} className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-l-md px-2 py-1 min-w-[36px]">
        <span className="text-[9px] text-slate-400 font-bold mb-0.5">משפחות</span>
        <span className="text-sm font-bold text-slate-700 leading-none">{fam || 0}</span>
      </${D}>
      <${D} className="flex flex-col items-center bg-indigo-50 border border-indigo-100 rounded-r-md px-2 py-1 min-w-[36px]">
        <span className="text-[9px] text-indigo-400 font-bold mb-0.5">משימות</span>
        <span className="text-sm font-bold text-indigo-700 leading-none">{task || 0}</span>
      </${D}>
    </${D}>
  );
}
`;

const imports = `import React, { useState } from 'react';
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

`;

const logicFixed = logic.replace(
  /function renderDualCell[\s\S]*?return \(\s*<div className="space-y-8">/,
  'return (\n    <div className="space-y-8">'
);

// Remove duplicate renderDualCell inside logic
const logic2 = logicFixed.replace(
  /\n  function renderDualCell[\s\S]*?\n  \}\n\n  return/,
  '\n\n  return'
);

// Insert renderDualFn before export
const out = imports + renderDualFn + logic2 + jsx + '\n    </motionless>\n  );\n}\n';
const fixed = out.replace(/<\/motionless>/g, '</div>').replace(/<motionless/g, '<div').replace(/\n    <\/motionless>\n/g, '\n    </motionless>\n');

writeFileSync(join(root, 'src/views/AnalyticsView.jsx'), fixed.replace(/<\/motionless>/g, '</div>').replace(/<motionless/g, '<motionless'));
// final fix motionless if any
let final = readFileSync(join(root, 'src/views/AnalyticsView.jsx'), 'utf8');
final = final.split('motionless').join('div');
writeFileSync(join(root, 'src/views/AnalyticsView.jsx'), final);
console.log('done', final.length);
