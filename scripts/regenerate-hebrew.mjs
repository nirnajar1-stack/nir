import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'src');

const H = {
  catBureau: '\u05d1\u05d9\u05e8\u05d5\u05e7\u05e8\u05d8\u05d9\u05d4 \u05d5\u05d6\u05db\u05d5\u05d9\u05d5\u05ea',
  catHealth: '\u05d1\u05e8\u05d9\u05d0\u05d5\u05ea \u05d5\u05e8\u05d5\u05d5\u05d7\u05d4',
  catEconomic: '\u05e1\u05d9\u05d5\u05e2 \u05db\u05dc\u05db\u05dc\u05d9 \u05d5\u05de\u05d2\u05d5\u05e8\u05d9\u05dd',
  catLogistics: '\u05dc\u05d5\u05d2\u05d9\u05e1\u05d8\u05d9\u05e7\u05d4 \u05d5\u05d3\u05d9\u05d2\u05d9\u05d8\u05dc',
  catLeisure: '\u05e4\u05e0\u05d0\u05d9 \u05d5\u05e9\u05d5\u05e0\u05d5\u05ea',
};

const L = {
  all: '\u05d4\u05db\u05dc',
  allCategories: '\u05db\u05dc \u05d4\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d5\u05ea',
  months: ['\u05d9\u05e0\u05d5\u05d0\u05e8', '\u05e4\u05d1\u05e8\u05d5\u05d0\u05e8', '\u05de\u05e8\u05e5', '\u05d0\u05e4\u05e8\u05d9\u05dc'],
  monthsShort: ['\u05d9\u05e0\u05d5', '\u05e4\u05d1\u05e8', '\u05de\u05e8\u05e5', '\u05d0\u05e4\u05e8'],
  appTitle: '\u05de\u05e2\u05e8\u05db\u05ea \u05e0\u05d9\u05ea\u05d5\u05d7 \u05de\u05e2\u05e0\u05d9\u05dd \u05de\u05d0\u05d5\u05d7\u05d3\u05ea',
  appSubtitle: '\u05e0\u05d9\u05ea\u05d5\u05d7 \u05d0\u05e8\u05d2\u05d5\u05e0\u05d9 (\u05d9\u05e0\u05d5\u05d0\u05e8\u2013\u05d0\u05e4\u05e8\u05d9\u05dc) \u05d5\u05e4\u05d9\u05dc\u05d5\u05d7 \u05dc\u05e4\u05d9 \u05de\u05ea\u05db\u05dc\u05dc\u05d9\u05dd (\u05d9\u05e0\u05d5\u05d0\u05e8)',
  sectionAnalytics: '\ud83d\udcca \u05e0\u05d9\u05ea\u05d5\u05d7 \u05de\u05e2\u05e0\u05d9\u05dd (\u05d9\u05e0\u05d5\u05d0\u05e8\u2013\u05d0\u05e4\u05e8\u05d9\u05dc)',
  sectionCoordinators: '\ud83d\udc65 \u05de\u05e2\u05e0\u05d9\u05dd \u05dc\u05e4\u05d9 \u05de\u05ea\u05db\u05dc\u05dc\u05d9\u05dd (\u05d9\u05e0\u05d5\u05d0\u05e8)',
  tabIntensity: '\ud83d\udcc9 \u05ea\u05e4\u05d5\u05e6\u05d4 \u05dc\u05e2\u05d5\u05de\u05ea \u05e2\u05e6\u05d9\u05de\u05d5\u05ea',
  tabSpread: '\ud83d\udd0e \u05d8\u05d1\u05dc\u05ea \u05e4\u05d9\u05d6\u05d5\u05e8 \u05de\u05d5\u05e8\u05d7\u05d1\u05ea',
  tabMatrix: '\ud83e\udde0 \u05de\u05d8\u05e8\u05d9\u05e6\u05ea \u05d4\u05d7\u05dc\u05d8\u05d5\u05ea (2D/3D)',
  tabOverview: '\ud83d\udcca \u05e4\u05d9\u05dc\u05d5\u05d7 \u05db\u05dc\u05dc\u05d9',
  tabCoordOverview: '\ud83d\udccb \u05ea\u05e7\u05e6\u05d9\u05e8 \u05d5\u05e4\u05e2\u05d9\u05dc\u05d5\u05ea',
  tabCoordHeatmap: '\ud83d\udd25 \u05e4\u05d9\u05d6\u05d5\u05e8 \u05e2\u05d5\u05de\u05e1\u05d9\u05dd',
  tabCoordDna: '\ud83e\uddec DNA \u05de\u05ea\u05db\u05dc\u05dc\u05d9\u05dd',
  tab3d: '\ud83d\ude80 \u05ea\u05dc\u05ea-\u05de\u05d9\u05de\u05d3 \u05d0\u05d9\u05e0\u05d8\u05e8\u05d0\u05e7\u05d8\u05d9\u05d1\u05d9',
  tab2d: '\ud83d\udcca \u05d3\u05d5-\u05de\u05d9\u05de\u05d3 (2D)',
  fullscreen: '\ud83d\udda5\ufe0f \u05de\u05e1\u05da \u05de\u05dc\u05d0',
  closeFullscreen: '\u274c \u05e1\u05d2\u05d5\u05e8 \u05de\u05e1\u05da \u05de\u05dc\u05d0',
  legend: '\u05de\u05e7\u05e8\u05d0 \u05e1\u05d9\u05d5\u05d5\u05d2\u05d9\u05dd:',
  families: '\u05de\u05e9\u05e4\u05d7\u05d5\u05ea',
  familiesShort: '\u05de\u05e9\u05e4\u05f3',
  tasks: '\u05de\u05e9\u05d9\u05de\u05d5\u05ea',
  days: '\u05d9\u05de\u05d9\u05dd',
  dayShort: '\u05d9\u05de\u05f3',
  inquiries: '\u05e4\u05e0\u05d9\u05d5\u05ea',
  searchPlaceholder: '\u05d7\u05e4\u05e9 \u05de\u05e9\u05d9\u05de\u05d4...',
  noResults: '\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05de\u05e9\u05d9\u05de\u05d5\u05ea.',
  noDataSpread: '\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05ea\u05d5\u05d0\u05de\u05d9\u05dd.',
  matrixTitle: '\u05de\u05d8\u05e8\u05d9\u05e6\u05ea \u05d4\u05d7\u05dc\u05d8\u05d5\u05ea \u05dc\u05d4\u05e2\u05d1\u05e8\u05ea \u05e9\u05e8\u05d1\u05d9\u05d8',
  matrixDescBefore: '\u05d6\u05d9\u05d4\u05d5\u05d9 \u05d5\u05d9\u05d6\u05d5\u05d0\u05dc\u05d9 \u05e9\u05dc \u05ea\u05d4\u05dc\u05d9\u05db\u05d9\u05dd \u05d3\u05d5\u05e8\u05e9\u05d9 \u05d4\u05ea\u05e2\u05e8\u05d1\u05d5\u05ea: ',
  matrixDescBold: '\u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05d1\u05e8\u05d1\u05d9\u05e2 \u05d4\u05d0\u05d3\u05d5\u05dd',
  matrixDescAfter: ' \u05de\u05d7\u05d9\u05d9\u05d1\u05d5\u05ea \u05de\u05d9\u05e0\u05d5\u05d9 \u05e8\u05e4\u05e8\u05e0\u05d8 \u05de\u05e7\u05e6\u05d5\u05e2\u05d9.',
  axisFamilies: '\u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05d9\u05d9\u05d7\u05d5\u05d3\u05d9\u05d5\u05ea',
  axisSpread: '\u05ea\u05e4\u05d5\u05e6\u05d4 - \u05db\u05de\u05d5\u05ea \u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05d1\u05d8\u05d9\u05e4\u05d5\u05dc',
  axisEffort: '\u05de\u05d0\u05de\u05e5 \u05ea\u05e4\u05e2\u05d5\u05dc\u05d9 - \u05d9\u05de\u05d9 \u05d8\u05d9\u05e4\u05d5\u05dc \u05e0\u05d3\u05e8\u05e9\u05d9\u05dd',
  axisTasksVolume: '\u05e0\u05e4\u05d7 \u05de\u05e9\u05d9\u05de\u05d5\u05ea',
  qHandoff: '\u05e8\u05d1\u05d9\u05e2 \u05d4\u05e2\u05d1\u05e8\u05ea \u05e9\u05e8\u05d1\u05d9\u05d8',
  qNiche: '\u05e8\u05d1\u05d9\u05e2 \u05de\u05d5\u05de\u05d7\u05d9\u05d5\u05ea \u05e0\u05d9\u05e9\u05d4',
  qBroad: '\u05d8\u05d9\u05e4\u05d5\u05dc \u05e9\u05d5\u05d8\u05e3 \u05e0\u05e8\u05d7\u05d1',
  qQuick: '\u05e4\u05e2\u05d5\u05dc\u05d5\u05ea \u05d1\u05d6\u05e7',
  overviewMain: '\u05de\u05d1\u05d8 \u05e2\u05dc: \u05e2\u05d5\u05de\u05e1 \u05dc\u05e4\u05d9 \u05e1\u05d9\u05d5\u05d5\u05d2 \u05e8\u05d0\u05e9\u05d9',
  overviewMainDesc: '\u05de\u05e1\u05e4\u05e8 \u05d4\u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05d5\u05d4\u05d6\u05de\u05df \u05d4\u05de\u05de\u05d5\u05e6\u05e2 \u05dc\u05e1\u05d2\u05d9\u05e8\u05ea \u05de\u05e2\u05d2\u05dc.',
  overviewSub: '\u05e8\u05d6\u05d5\u05dc\u05d5\u05e6\u05d9\u05d4: \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05dc\u05e4\u05d9 \u05ea\u05ea-\u05e1\u05d9\u05d5\u05d5\u05d2',
  overviewSubDesc: '\u05d3\u05d9\u05e8\u05d5\u05d2 \u05d4\u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05de\u05d4\u05e0\u05e4\u05d5\u05e6\u05d4 \u05d1\u05d9\u05d5\u05ea\u05e8 \u05dc\u05e0\u05d3\u05d9\u05e8\u05d4 (10 \u05d4\u05e8\u05d0\u05e9\u05d5\u05e0\u05d5\u05ea).',
  fullscreenTitle: '\u05de\u05d8\u05e8\u05d9\u05e6\u05ea \u05d4\u05d7\u05dc\u05d8\u05d5\u05ea \u05d0\u05e1\u05d8\u05e8\u05d8\u05d2\u05d9\u05ea - \u05de\u05e1\u05da \u05de\u05dc\u05d0',
  fullscreenDesc: '\u05d0\u05d9\u05e4\u05d9\u05d5\u05df \u05d5\u05e1\u05d9\u05d5\u05d5\u05d2 \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05ea\u05d7\u05ea \u05de\u05d8\u05d4 \u05d1\u05e7\u05e8\u05d4 \u05d0\u05e8\u05e6\u05d9.',
  chartFam: '\u05ea\u05e4\u05d5\u05e6\u05d4: \u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05de\u05e2\u05d5\u05e8\u05d1\u05d5\u05ea',
  chartTasks: '\u05e2\u05d5\u05de\u05e1: \u05e1\u05da \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05e9\u05e0\u05e4\u05ea\u05d7\u05d5',
  intensityTitle: '\u05d0\u05e4\u05d9\u05d5\u05df \u05e2\u05e6\u05d9\u05de\u05d5\u05ea:',
  ratioLabel: '\u05d9\u05d7\u05e1 \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05dc\u05de\u05e9\u05e4\u05d7\u05d4',
  totalLabel: '\u05e1\u05da \u05d4\u05db\u05dc (\u05d9\u05e0\u05d5\u05f3-\u05d0\u05e4\u05e8\u05f3)',
  spreadTitle: '\u05d8\u05d1\u05dc\u05ea \u05e4\u05d9\u05d6\u05d5\u05e8 \u05de\u05d5\u05e8\u05d7\u05d1\u05ea',
  spreadDesc: '\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4 \u05d7\u05d5\u05d3\u05e9\u05d9\u05ea \u05de\u05e4\u05d5\u05e8\u05d8\u05ea: \u05db\u05de\u05d5\u05ea \u05d4\u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05d0\u05dc \u05de\u05d5\u05dc \u05d4\u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05d1\u05db\u05dc \u05ea\u05ea-\u05e1\u05d9\u05d5\u05d5\u05d2.',
  intensityCol: '\u05d9\u05d7\u05e1 \u05e2\u05e6\u05d9\u05de\u05d5\u05ea \u05db\u05dc\u05dc\u05d9',
  heatmapTasksTitle: '\u05de\u05e4\u05ea \u05e2\u05d5\u05de\u05e1\u05d9\u05dd \u05dc\u05e4\u05d9 \u05de\u05e9\u05d9\u05de\u05d5\u05ea',
  heatmapTasksDesc: '\u05de\u05e4\u05ea \u05d4\u05d7\u05d5\u05dd \u05de\u05e9\u05e7\u05e4\u05ea \u05d0\u05ea \u05e1\u05da \u05d4\u05de\u05e9\u05d9\u05de\u05d5\u05ea. \u05dc\u05d7\u05e5 \u05e2\u05dc \u05e9\u05d5\u05e8\u05d4 \u05dc\u05e0\u05d9\u05ea\u05d5\u05d7 \u05d4\u05e9\u05d5\u05d5\u05d0\u05ea\u05d9.',
  decisionTitle: '\u05d4\u05d7\u05dc\u05d8\u05d4 \u05de\u05d1\u05d5\u05e1\u05e1\u05ea \u05e0\u05e8\u05d8\u05d9\u05d1: \u05ea\u05e4\u05d5\u05e6\u05d4 \u05de\u05d5\u05dc \u05e2\u05e6\u05d9\u05de\u05d5\u05ea',
  decisionBody: '\u05d4\u05e9\u05d5\u05d5\u05d0\u05d4 \u05d1\u05d9\u05df \u05de\u05e1\u05e4\u05e8 \u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05dc\u05de\u05e1\u05e4\u05e8 \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05de\u05d0\u05e4\u05e9\u05e8\u05ea \u05dc\u05d6\u05d4\u05d5\u05ea \u05d0\u05dd \u05e2\u05d5\u05de\u05e1 \u05e8\u05d5\u05d7\u05d1\u05d9 \u05d0\u05d5 \u05e0\u05e7\u05d5\u05d3\u05d9.',
  badgeExtreme: '\u05de\u05d5\u05e8\u05db\u05d1\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05ea',
  badgeExtremeHint: '\u05de\u05e2\u05dc 1.8 \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05dc\u05de\u05e9\u05e4\u05d7\u05d4',
  badgeMedium: '\u05e2\u05d5\u05de\u05e1 \u05de\u05de\u05d5\u05e6\u05e2',
  badgeMediumHint: '~ 1.5 \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05dc\u05de\u05e9\u05e4\u05d7\u05d4',
  badgeSmooth: '\u05e9\u05d9\u05e8\u05d5\u05ea \u05d7\u05dc\u05e7',
  badgeSmoothHint: '\u05d9\u05d7\u05e1 1:1 \u05dc\u05de\u05e9\u05e4\u05d7\u05d4',
  thSub: '\u05ea\u05ea-\u05e1\u05d9\u05d5\u05d5\u05d2',
  thCategory: '\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4 \u05d5\u05ea\u05ea-\u05e1\u05d9\u05d5\u05d5\u05d2',
  hoverX: '\u05ea\u05e4\u05d5\u05e6\u05d4 (X):',
  hoverY: '\u05de\u05e9\u05da \u05d8\u05d9\u05e4\u05d5\u05dc (Y):',
  hoverZ: '\u05e1\u05da \u05de\u05e9\u05d9\u05de\u05d5\u05ea (Z):',
  axisLegendTitle: '\u05de\u05e7\u05e8\u05d0 \u05e6\u05d9\u05e8\u05d9\u05dd:',
  axisX: '\u05e6\u05d9\u05e8 X \u05d0\u05d5\u05e4\u05e7\u05d9: \u05ea\u05e4\u05d5\u05e6\u05d4 (\u05de\u05e9\u05e4\u05d7\u05d5\u05ea)',
  axisY: '\u05e6\u05d9\u05e8 Y \u05d0\u05e0\u05db\u05d9: \u05d6\u05de\u05df \u05d8\u05d9\u05e4\u05d5\u05dc (SLA)',
  axisZ: '\u05e6\u05d9\u05e8 Z \u05e2\u05d5\u05de\u05e7: \u05e0\u05e4\u05d7 \u05de\u05e9\u05d9\u05de\u05d5\u05ea',
  axisHint: '* \u05d2\u05e8\u05d5\u05e8 \u05e2\u05db\u05d1\u05e8 \u05dc\u05e1\u05d9\u05d1\u05d5\u05d1 | \u05d2\u05dc\u05d5\u05dc \u05dc\u05d6\u05d5\u05dd',
  loading3d: '\u05d8\u05d5\u05e2\u05df \u05de\u05e8\u05d7\u05d1 \u05ea\u05dc\u05ea-\u05de\u05d9\u05de\u05d3...',
  tasksName: '\u05de\u05e9\u05d9\u05de\u05d5\u05ea',
  tooltipFamilies: '\u05de\u05e9\u05e4\u05d7\u05d5\u05ea \u05de\u05dc\u05d5\u05d5\u05d5\u05ea',
  tooltipAvgSla: '\u05d6\u05de\u05df \u05d8\u05d9\u05e4\u05d5\u05dc \u05de\u05de\u05d5\u05e6\u05e2',
  tooltipSpread: '\u05ea\u05e4\u05d5\u05e6\u05d4',
  tooltipSla: '\u05de\u05d0\u05de\u05e5 (SLA)',
};

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function jsStr(s) {
  return `'${esc(s)}'`;
}

const labelEntries = Object.entries(L).map(([k, v]) => {
  if (Array.isArray(v)) {
    return `  ${k}: [${v.map((x) => jsStr(x)).join(', ')}],`;
  }
  return `  ${k}: ${jsStr(v)},`;
});

const dataJs = `export { mainCategoryData, subCategoryData } from './data/analyticsData.js';
export { coordinators, categories, rawData } from './data/coordinatorData.js';

export const COLORS = {
  ${jsStr(H.catBureau)}: '#3B82F6',
  ${jsStr(H.catHealth)}: '#EF4444',
  ${jsStr(H.catLogistics)}: '#8B5CF6',
  ${jsStr(H.catEconomic)}: '#10B981',
  ${jsStr(H.catLeisure)}: '#F59E0B',
};

export const BRAND_CHART_COLORS = ['#004795', '#FFC107', '#002855', '#FF8F00', '#16a34a', '#4b5563'];

export const LABELS = {
${labelEntries.join('\n')}
};
`;

fs.writeFileSync(path.join(src, 'data.js'), dataJs, 'utf8');

const tooltipsJs = `import React from 'react';
import { COLORS, LABELS } from '../data.js';

const tooltipBase = 'bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl text-right';

export const CustomTooltipMain = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className={\`\${tooltipBase} min-w-[180px]\`} dir="rtl">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <motion.div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[data.category] }} />
        <p className="font-bold text-slate-800">{data.category}</p>
      </div>
      <p className="text-sm text-slate-600 mb-1 flex justify-between gap-4">
        <span>${esc(L.tooltipFamilies)}:</span>
        <span className="font-bold text-slate-800">{data.families}</span>
      </p>
      <p className="text-sm text-slate-600 flex justify-between gap-4">
        <span>${esc(L.tooltipAvgSla)}:</span>
        <span className="font-bold text-slate-800">{data.avgSla} ${esc(L.dayShort)}</span>
      </p>
    </div>
  );
};

export const CustomTooltipSub = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className={\`\${tooltipBase} min-w-[200px]\`} dir="rtl">
      <p className="font-bold text-slate-800 mb-1">{data.sub}</p>
      <p className="text-xs text-slate-500 font-medium mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[data.main] }} />
        {data.main}
      </p>
      <p className="text-sm text-slate-600 mb-1 flex justify-between gap-4">
        <span>${esc(L.tooltipSpread)}:</span>
        <span className="font-bold text-slate-800">{data.families} ${esc(L.families)}</span>
      </p>
      <p className="text-sm text-slate-600 mb-1 flex justify-between gap-4">
        <span>${esc(L.tooltipSla)}:</span>
        <span className="font-bold text-slate-800">{data.sla} ${esc(L.days)}</span>
      </p>
      {data.tasks != null && (
        <p className="text-sm text-slate-600 flex justify-between gap-4">
          <span>${esc(L.tasks)}:</span>
          <span className="font-bold text-slate-800">{data.tasks}</span>
        </p>
      )}
    </motion.div>
  );
};

export const CustomTooltipScatter = CustomTooltipSub;
`;

// Fix tooltips - remove motion typos
const tooltipsFixed = tooltipsJs
  .replace(/motion\.div/g, 'div')
  .replace(/<\/motion\.motion.div>/g, '</div>')
  .replace(/<\/motion\.div>/g, '</div>');

fs.writeFileSync(path.join(src, 'components', 'Tooltips.jsx'), tooltipsFixed, 'utf8');

const intensityJs = `export function getIntensityClassification(families, tasks) {
  if (families === 0 || tasks === 0) {
    return {
      label: '\\u05dc\\u05dc\\u05d0 \\u05e4\\u05e2\\u05d9\\u05dc\\u05d5\\u05ea',
      ratio: '\\u2014',
      color: 'bg-slate-100 text-slate-500 border-slate-200',
      desc: '\\u05d0\\u05d9\\u05df \\u05e0\\u05ea\\u05d5\\u05e0\\u05d9 \\u05e4\\u05e2\\u05d9\\u05dc\\u05d5\\u05ea \\u05d1\\u05ea\\u05e7\\u05d5\\u05e4\\u05d4.',
    };
  }
  const ratio = tasks / families;
  if (ratio > 1.8) {
    return {
      label: '\\u05de\\u05d5\\u05e8\\u05db\\u05d1\\u05d5\\u05ea \\u05e7\\u05d9\\u05e6\\u05d5\\u05e0\\u05d9\\u05ea',
      ratio: ratio.toFixed(1),
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: '\\u05de\\u05e1\\u05e4\\u05e8 \\u05de\\u05e9\\u05d9\\u05de\\u05d5\\u05ea \\u05d2\\u05d1\\u05d5\\u05d4 \\u05dc\\u05de\\u05e9\\u05e4\\u05d7\\u05d4 - \\u05de\\u05e2\\u05d9\\u05d3 \\u05e2\\u05dc \\"\\u05e4\\u05d9\\u05e0\\u05d2-\\u05e4\\u05d5\\u05e0\\u05d2\\" \\u05d0\\u05d5 \\u05d8\\u05d9\\u05e4\\u05d5\\u05dc \\u05e9\\u05d0\\u05d9\\u05e0\\u05d5 \\u05e0\\u05e1\\u05d2\\u05e8.',
    };
  }
  if (ratio > 1.3) {
    return {
      label: '\\u05e2\\u05d5\\u05de\\u05e1 \\u05de\\u05de\\u05d5\\u05e6\\u05e2',
      ratio: ratio.toFixed(1),
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: '\\u05de\\u05e2\\u05d8 \\u05de\\u05e2\\u05d2\\u05dc\\u05d9\\u05dd \\u05e4\\u05ea\\u05d5\\u05d7\\u05d9\\u05dd \\u05d1\\u05de\\u05e7\\u05d1\\u05d9\\u05dc \\u05dc\\u05de\\u05e9\\u05e4\\u05d7\\u05d4.',
    };
  }
  return {
    label: '\\u05e9\\u05d9\\u05e8\\u05d5\\u05ea \\u05d7\\u05dc\\u05e7 \\u05d5\\u05d9\\u05e9\\u05d9\\u05e8',
    ratio: ratio.toFixed(1),
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: '\\u05db\\u05de\\u05e2\\u05d8 \\u05db\\u05dc \\u05de\\u05e9\\u05d9\\u05de\\u05d4 \\u05de\\u05d9\\u05d9\\u05e6\\u05e2\\u05ea \\u05de\\u05e9\\u05e4\\u05d7\\u05d4 \\u05e9\\u05d5\\u05e0\\u05d4 (\\u05d9\\u05d7\\u05e1 1:1).',
  };
}
`;

fs.writeFileSync(path.join(src, 'utils', 'intensity.js'), intensityJs, 'utf8');

console.log('Regenerated data.js, Tooltips.jsx, intensity.js');
