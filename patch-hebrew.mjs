import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(root, 'src/App.jsx');
let app = fs.readFileSync(appPath, 'utf8');

const subs = [
  [/<h3 className="text-xl font-extrabold text-slate-800">[^<]+<\/h3>/, '<h3 className="text-xl font-extrabold text-slate-800">{LABELS.decisionTitle}</h3>'],
  [/<p className="text-slate-600 text-sm leading-relaxed mb-4">\s*[\s\S]*?<\/p>\s*<p className="text-indigo-600/, '<p className="text-slate-600 text-sm leading-relaxed mb-4">{LABELS.decisionBody}</p>\n              <p className="text-indigo-600'],
  [/<span>💡<\/span> [^<]+/, '<span>💡</span> {LABELS.decisionConclusion}'],
  [/font-bold text-rose-900[^>]+>[^<]+</, 'font-bold text-rose-900 bg-rose-100 border border-rose-200/60 px-2.5 py-1 rounded-md">{LABELS.badgeCoreHigh}</'],
  [/font-bold text-amber-900[^>]+>[^<]+</, 'font-bold text-amber-900 bg-amber-100 border border-amber-200/60 px-2.5 py-1 rounded-md">{LABELS.badgeSpike}</'],
  [/font-bold text-emerald-900[^>]+>[^<]+</, 'font-bold text-emerald-900 bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-md">{LABELS.badgeStable}</'],
  [/text-slate-600 font-extrabold">4 [^<]+</, 'text-slate-600 font-extrabold">{LABELS.tasks4}</'],
  [/text-slate-600 font-extrabold">3 [^<]+</, 'text-slate-600 font-extrabold">{LABELS.tasks3}</'],
  [/text-slate-600 font-extrabold">5 [^<]+</, 'text-slate-600 font-extrabold">{LABELS.tasks5}</'],
  [/<h2 className="text-xl font-bold text-slate-800">[^<]+<\/h2>/, '<h2 className="text-xl font-bold text-slate-800">{LABELS.tasksListTitle}</h2>'],
  [/<p className="text-xs text-slate-500 mt-1">[^<]+<\/p>/, '<p className="text-xs text-slate-500 mt-1">{LABELS.heatmapDesc}</p>'],
  [/placeholder="[^"]+"/, 'placeholder={LABELS.searchPlaceholder}'],
  [/<option value="[^"]+">[^<]+<\/option>/, '<option value={LABELS.all}>{LABELS.allCategories}</option>'],
  [/<th className="pb-3 pr-2">[^<]+<\/th>/, '<th className="pb-3 pr-2">{LABELS.thSub}</th>'],
  [/<th className="pb-3 text-center">[^<]+<\/th>\s*<th className="pb-3 text-center">[^<]+<\/th>\s*<th className="pb-3 text-center">[^<]+<\/th>\s*<th className="pb-3 text-center">[^<]+<\/th>\s*<th className="pb-3 text-center">[^<]+<\/th>/,
    `<th className="pb-3 text-center">{LABELS.monthsShort[0]}</th>
                      <th className="pb-3 text-center">{LABELS.monthsShort[1]}</th>
                      <th className="pb-3 text-center">{LABELS.monthsShort[2]}</th>
                      <th className="pb-3 text-center">{LABELS.monthsShort[3]}</th>
                      <th className="pb-3 text-center">{LABELS.thContinuity}</th>`],
  [/colSpan="6"[^>]+>\s*[^<]+\s*<\/td>/, 'colSpan="6" className="py-12 text-center text-slate-400">{LABELS.noResults}</td>'],
  [/<span>💡<\/span>\s*\n\s*אפיון/, '<span>📉</span>\n                  {LABELS.volatility}'],
  [/block mb-1">[^<]+<\/span>\s*<span className="text-lg font-bold[^]+?\/ 4\)\.toFixed\(1\)\} [^<]+/, 'block mb-1">{LABELS.monthlyAvg}</span>\n                    <span className="text-lg font-bold text-slate-800">\n                      {((selectedSubCategory.jan + selectedSubCategory.feb + selectedSubCategory.mar + selectedSubCategory.apr) / 4).toFixed(1)} {LABELS.inquiries}'],
  [/block mb-1">[^<]+<\/span>\s*<span className="text-lg font-bold[^]+?apr\)\} [^<]+/, 'block mb-1">{LABELS.rangeLabel}</span>\n                    <span className="text-lg font-bold text-slate-800">\n                      {Math.min(selectedSubCategory.jan, selectedSubCategory.feb, selectedSubCategory.mar, selectedSubCategory.apr)} - {Math.max(selectedSubCategory.jan, selectedSubCategory.feb, selectedSubCategory.mar, selectedSubCategory.apr)} {LABELS.inquiries}'],
  [/<h2 className="text-2xl font-extrabold text-slate-800">[^<]+<\/h2>\s*<\/div>\s*<p className="text-slate-600">/,
    '<h2 className="text-2xl font-extrabold text-slate-800">{LABELS.matrixTitle}</h2>\n              </motion.div>\n              <p className="text-slate-600">'],
];

// Fix accidental motion.div in replacement
for (const [re, rep] of subs) {
  if (app.match(re)) app = app.replace(re, rep);
}

// Matrix description
app = app.replace(
  /<p className="text-slate-600">\s*[\s\S]*?<\/p>\s*<\/div>\s*\n\s*{\/\* Toggle Controls/,
  `<p className="text-slate-600">{LABELS.matrixDescBefore}<strong>{LABELS.matrixDescBold}</strong>{LABELS.matrixDescAfter}</p>
            </div>

            {/* Toggle Controls`
);

// Matrix buttons
app = app.replace(/\?\?[^\n<]+תלת[^\n<]*/g, '{LABELS.tab3d}');
app = app.replace(/\?\?[^\n<]*דו-מימד \(2D\)/g, '{LABELS.tab2d}');
app = app.replace(/\?\?\?[^\n<]+/g, '{LABELS.fullscreen}');
app = app.replace(/\? סגור/g, '{LABELS.closeFullscreen}');

// Chart axes - replace name and label value strings
const axisReplacements = [
  [/name="[^"]*ייחודיות[^"]*"/g, 'name={LABELS.axisFamilies}'],
  [/label=\{\{ value: '[^']*משפחות[^']*',/g, 'label={{ value: LABELS.axisSpread,'],
  [/name="[^"]*ימי[^"]*"/g, 'name={LABELS.axisDays}'],
  [/label=\{\{ value: '[^']*מאמץ[^']*',/g, 'label={{ value: LABELS.axisEffort,'],
  [/name="[^"]*זמן[^"]*"/g, 'name={LABELS.axisTime}'],
  [/fontSize="18"[^>]+>[^<]+שרביט[^<]*</g, 'fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qHandoff}</text>'],
  [/fontSize="18"[^>]+>[^<]+נישה[^<]*</g, 'fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qNiche}</text>'],
  [/fontSize="18"[^>]+>[^<]+נרחב[^<]*</g, 'fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qBroad}</text>'],
  [/fontSize="18"[^>]+>[^<]+בזק[^<]*</g, 'fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qQuick}</text>'],
  [/fontSize="24"[^>]+>[^<]+שרביט[^<]*</g, 'fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qHandoff}</text>'],
  [/fontSize="24"[^>]+>[^<]+נישה[^<]*</g, 'fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qNiche}</text>'],
  [/fontSize="24"[^>]+>[^<]+נרחב[^<]*</g, 'fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qBroad}</text>'],
  [/fontSize="24"[^>]+>[^<]+בזק[^<]*</g, 'fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qQuick}</text>'],
  [/<Scatter\s+name="[^"]+"/g, '<Scatter name={LABELS.tasksName}'],
  [/formatter=\{\(value\) => `\$\{value\} [^`]+`\}/g, 'formatter={(value) => `${value} ${LABELS.days}`}'],
  [/formatter=\{\(value\) => `\$\{value\} ימ/g, 'formatter={(value) => `${value} ${LABELS.dayShort}`}'],
];

for (const [re, rep] of axisReplacements) {
  app = app.replace(re, rep);
}

// Overview section titles
app = app.replace(/<h2 className="text-xl font-bold text-slate-800">מבט[^<]*<\/h2>/g, '<h2 className="text-xl font-bold text-slate-800">{LABELS.overviewMain}</h2>');
app = app.replace(/<p className="text-sm text-slate-500">מספר[^<]*<\/p>/g, '<p className="text-sm text-slate-500">{LABELS.overviewMainDesc}</p>');
app = app.replace(/<h2 className="text-xl font-bold text-slate-800">רזול[^<]*<\/h2>/g, '<h2 className="text-xl font-bold text-slate-800">{LABELS.overviewSub}</h2>');
app = app.replace(/<p className="text-sm text-slate-500">דירוג[^<]*<\/p>/g, '<p className="text-sm text-slate-500">{LABELS.overviewSubDesc}</p>');

// Fullscreen header
app = app.replace(/<h2 className="text-2xl font-black text-slate-100">[^<]+מסך[^<]*<\/h2>/g, '<h2 className="text-2xl font-black text-slate-100">{LABELS.fullscreenTitle}</h2>');
app = app.replace(/<p className="text-sm text-slate-400">[^<]+ארצי[^<]*<\/p>/g, '<p className="text-sm text-slate-400">{LABELS.fullscreenDesc}</p>');

app = app.replace(/motion\.div/g, 'div');
app = app.replace(/<span className="text-slate-500 font-medium text-sm border-l[^>]+>[^<]+<\/span>/, '<span className="text-slate-500 font-medium text-sm border-l border-slate-200 pl-4 ml-2">{LABELS.legend}</span>');

fs.writeFileSync(appPath, app, 'utf8');
console.log('App.jsx patched');

// Interactive3DChart
const chartPath = path.join(root, 'src/components/Interactive3DChart.jsx');
let chart = fs.readFileSync(chartPath, 'utf8');
if (!chart.includes('LABELS')) {
  chart = chart.replace(
    "import { COLORS, subCategoryData } from '../data.js';",
    "import { COLORS, subCategoryData, LABELS } from '../data.js';"
  );
}
chart = chart
  .replace(/<p className="text-lg">[^<]+<\/p>/, '<p className="text-lg">{LABELS.loading3d}</p>')
  .replace(/\{lbl\.sla\} [^|]+ \| \{lbl\.families\} [^<]+/, '{lbl.sla} {LABELS.dayShort} | {lbl.families} {LABELS.familiesShort}')
  .replace(/<motion.div className="font-bold[^>]+>[^<]+:/, '<div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{LABELS.axisLegendTitle}</motion.div>')
  .replace(/ציר X[^<]+/g, '{LABELS.axisX}')
  .replace(/ציר Y[^<]+/g, '{LABELS.axisY}')
  .replace(/ציר Z[^<]+/g, '{LABELS.axisZ}')
  .replace(/\* [^<]+זום[^<]*/, '{LABELS.axisHint}')
  .replace(/<span>תפוצה \(X\):<\/span>/, '<span>{LABELS.hoverX}</span>')
  .replace(/<span>משך[^<]+\(Y\):<\/span>/, '<span>{LABELS.hoverY}</span>')
  .replace(/<span>סך[^<]+\(Z\):<\/span>/, '<span>{LABELS.hoverZ}</span>')
  .replace(/\{hoveredPoint\.families\} [^<]+/, '{hoveredPoint.families} {LABELS.families}')
  .replace(/\{hoveredPoint\.sla\} [^<]+/, '{hoveredPoint.sla} {LABELS.days}')
  .replace(/\{hoveredPoint\.tasks\} [^<]+/, '{hoveredPoint.tasks} {LABELS.inquiries}')
  .replace(/motion\.motion\.div/g, 'div')
  .replace(/motion\.motion.div/g, 'motion.div')
  .replace(/<motion.div className="font-bold/, '<div className="font-bold')
  .replace(/<\/motion.div>\s*<div className="flex items-center gap-2">\s*<div className="w-3 h-0.5 bg-red-500">/, '</motion.div>\n        <div className="flex items-center gap-2">\n          <div className="w-3 h-0.5 bg-red-500">');

// Simpler chart patch
chart = fs.readFileSync(chartPath, 'utf8');
if (!chart.includes('LABELS')) {
  chart = chart.replace(
    "import { COLORS, subCategoryData } from '../data.js';",
    "import { COLORS, subCategoryData, LABELS } from '../data.js';"
  );
}
const chartPatches = [
  [/<p className="text-lg">[^<]*<\/p>/, '<p className="text-lg">{LABELS.loading3d}</p>'],
  [/\{lbl\.sla\} [^|]+\| \{lbl\.families\} [^<']+/, '{lbl.sla} {LABELS.dayShort} | {lbl.families} {LABELS.familiesShort}'],
  [/font-bold text-slate-200[^>]+>[^<:]+<\/div>/, 'font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{LABELS.axisLegendTitle}</div>'],
  [/<span>ציר X[^<]*<\/span>/, '<span>{LABELS.axisX}</span>'],
  [/<span>ציר Y[^<]*<\/span>/, '<span>{LABELS.axisY}</span>'],
  [/<span>ציר Z[^<]*<\/span>/, '<span>{LABELS.axisZ}</span>'],
  [/\* [^<]*זום[^<]*/, '{LABELS.axisHint}'],
  [/<span>[^<]*\(X\):<\/span>/, '<span>{LABELS.hoverX}</span>'],
  [/<span>[^<]*\(Y\):<\/span>/, '<span>{LABELS.hoverY}</span>'],
  [/<span>[^<]*\(Z\):<\/span>/, '<span>{LABELS.hoverZ}</span>'],
  [/\{hoveredPoint\.families\} [\u0590-\u05ff\s]+/, '{hoveredPoint.families} {LABELS.families}'],
  [/\{hoveredPoint\.sla\} [\u0590-\u05ff]+/, '{hoveredPoint.sla} {LABELS.days}'],
  [/\{hoveredPoint\.tasks\} [\u0590-\u05ff]+/, '{hoveredPoint.tasks} {LABELS.inquiries}'],
];
for (const [re, rep] of chartPatches) {
  chart = chart.replace(re, rep);
}
fs.writeFileSync(chartPath, chart, 'utf8');
console.log('Interactive3DChart.jsx patched');

// BadgeLabel
let badge = fs.readFileSync(path.join(root, 'src/components/BadgeLabel.jsx'), 'utf8');
if (!badge.includes('LABELS')) {
  badge = `import { LABELS } from '../data.js';\n${badge}`;
}
badge = badge.replace(/\{sla\} [^|]+ \| \{families\} [^'"]+/, '{sla} {LABELS.days} | {families} {LABELS.familiesShort}');
fs.writeFileSync(path.join(root, 'src/components/BadgeLabel.jsx'), badge, 'utf8');
console.log('BadgeLabel.jsx patched');
