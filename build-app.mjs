import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const raw = fs.readFileSync(path.join(root, 'Dashboard.jsx'), 'utf8');
const lines = raw.split('\n');

const badge = [
  "import React from 'react';",
  '',
  ...lines.slice(149, 179).map((line) =>
    line.replace('const renderCustomBadgeLabel = (props) => {', 'export function renderCustomBadgeLabel(props) {').replace('const renderCustomBadgeLabel', 'export function renderCustomBadgeLabel')
  ),
].join('\n');

const chart = [
  "import React, { useState, useEffect, useRef } from 'react';",
  "import { COLORS, subCategoryData } from '../data.js';",
  '',
  lines[181].replace('const Interactive3DChart', 'export default function Interactive3DChart').replace(' = ({', '({'),
  ...lines.slice(182, 464),
].join('\n');

const header = `import React, { useState } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, ReferenceLine, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, AreaChart, Area } from 'recharts';
import { mainCategoryData, subCategoryData, COLORS } from './data.js';
import { getHeatmapBg, getContinuityClassification } from './utils.js';
import { CustomTooltipMain, CustomTooltipSub, CustomTooltipScatter } from './components/Tooltips.jsx';
import { renderCustomBadgeLabel } from './components/BadgeLabel.jsx';
import Interactive3DChart from './components/Interactive3DChart.jsx';

`;

const emojiFixes = [
  ['?? רציפות תפעולית', '📈 רציפות תפעולית'],
  ['?? מטריצת החלטות', '🎯 מטריצת החלטות'],
  ['?? פילוח קטגוריות', '📊 פילוח קטגוריות'],
  ['<span className="text-2xl">?</span>', '<span className="text-2xl">💡</span>'],
  ['<span>??</span>', '<span>💡</span>'],
  ['text-slate-400">??</span>', 'text-slate-400">🔍</span>'],
  ['text-indigo-600 text-2xl leading-none">??</span>', 'text-indigo-600 text-2xl leading-none">🎯</span>'],
  ['?? תלת-מימד אינטראקטיבי', '🧊 תלת-מימד אינטראקטיבי'],
  ['?? דו-מימד (2D)', '📉 דו-מימד (2D)'],
  ['??? מסך מלא', '⛶ מסך מלא'],
  ['text-blue-600 text-xl leading-none">??</span>', 'text-blue-600 text-xl leading-none">📊</span>'],
  ['text-emerald-600 text-xl leading-none">??</span>', 'text-emerald-600 text-xl leading-none">📋</span>'],
  ['<span className="text-3xl">??</span>', '<span className="text-3xl">🎯</span>'],
  ['? סגור מסך מלא', '✕ סגור מסך מלא'],
];

let app = header + lines.slice(465).join('\n');
for (const [from, to] of emojiFixes) {
  app = app.split(from).join(to);
}

fs.mkdirSync(path.join(__dirname, 'src/components'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'src/components/BadgeLabel.jsx'), badge, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src/components/Interactive3DChart.jsx'), chart, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src/App.jsx'), app, 'utf8');
console.log('Built successfully');
