import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const appPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/App.jsx');
const lines = fs.readFileSync(appPath, 'utf8').split('\n');

const set = (idx, content) => {
  lines[idx] = content;
};

// 0-based line indices from read output
set(74, '                <h3 className="text-xl font-extrabold text-slate-800">{LABELS.decisionTitle}</h3>');
set(76, '              <p className="text-slate-600 text-sm leading-relaxed mb-4">{LABELS.decisionBody}</p>');
set(77, '');
set(78, '');
set(79, '              <p className="text-indigo-600 font-extrabold text-sm flex items-center gap-1.5">');
set(80, '                <span>💡</span> {LABELS.decisionConclusion}');
set(87, '                <span className="font-bold text-rose-900 bg-rose-100 border border-rose-200/60 px-2.5 py-1 rounded-md">{LABELS.badgeCoreHigh}</span>');
set(88, '                <span className="text-slate-600 font-extrabold">{LABELS.tasks4}</span>');
set(91, '                <span className="font-bold text-amber-900 bg-amber-100 border border-amber-200/60 px-2.5 py-1 rounded-md">{LABELS.badgeSpike}</span>');
set(92, '                <span className="text-slate-600 font-extrabold">{LABELS.tasks3}</span>');
set(95, '                <span className="font-bold text-emerald-900 bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-md">{LABELS.badgeStable}</span>');
set(96, '                <span className="text-slate-600 font-extrabold">{LABELS.tasks5}</span>');
set(109, '                  <h2 className="text-xl font-bold text-slate-800">{LABELS.tasksListTitle}</h2>');
set(110, '                  <p className="text-xs text-slate-500 mt-1">{LABELS.heatmapDesc}</p>');
set(118, '                      placeholder={LABELS.searchPlaceholder}');
set(132, '                    <option value={LABELS.all}>{LABELS.allCategories}</option>');
set(145, '                      <th className="pb-3 pr-2">{LABELS.thSub}</th>');
set(146, '                      <th className="pb-3 text-center">{LABELS.monthsShort[0]}</th>');
set(147, '                      <th className="pb-3 text-center">{LABELS.monthsShort[1]}</th>');
set(148, '                      <th className="pb-3 text-center">{LABELS.monthsShort[2]}</th>');
set(149, '                      <th className="pb-3 text-center">{LABELS.monthsShort[3]}</th>');
set(150, '                      <th className="pb-3 text-center">{LABELS.thContinuity}</th>');
set(182, '                          {LABELS.noResults}');

// Volatility card ~234-253
set(234, '                  <span>📉</span>');
set(235, '                  {LABELS.volatility} {getContinuityClassification(selectedSubCategory.jan, selectedSubCategory.feb, selectedSubCategory.mar, selectedSubCategory.apr).label}');
set(244, '                    <span className="text-slate-400 block mb-1">{LABELS.monthlyAvg}</span>');
set(246, '                      {((selectedSubCategory.jan + selectedSubCategory.feb + selectedSubCategory.mar + selectedSubCategory.apr) / 4).toFixed(1)} {LABELS.inquiries}');
set(250, '                    <span className="text-slate-400 block mb-1">{LABELS.rangeLabel}</span>');
set(252, '                      {Math.min(selectedSubCategory.jan, selectedSubCategory.feb, selectedSubCategory.mar, selectedSubCategory.apr)} - {Math.max(selectedSubCategory.jan, selectedSubCategory.feb, selectedSubCategory.mar, selectedSubCategory.apr)} {LABELS.inquiries}');

// Matrix tab
set(273, '                <h2 className="text-2xl font-extrabold text-slate-800">{LABELS.matrixTitle}</h2>');
set(275, '              <p className="text-slate-600">{LABELS.matrixDescBefore}<strong>{LABELS.matrixDescBold}</strong>{LABELS.matrixDescAfter}</p>');
set(287, '                  {LABELS.tab3d}');
set(293, '                  {LABELS.tab2d}');
set(301, '                {LABELS.fullscreen}');

let app = lines.join('\n');

// Scatter chart axes and quadrants - global regex on joined content
const globalFixes = [
  [/name="[^"]{4,}"/g, (m) => (m.includes('label') ? m : 'name={LABELS.axisFamilies}')],
];

app = app.replace(/name="משפחות ייחודיות"|name="[^"]*[\u0080-\uFFFF]{3}[^"]*"/g, 'name={LABELS.axisFamilies}');
app = app.replace(/label=\{\{ value: '[^']{5,}', position: 'bottom'/g, "label={{ value: LABELS.axisSpread, position: 'bottom'");
app = app.replace(/name="ימי טיפול"|name="[^"]*ימי[^"]*"/g, 'name={LABELS.axisDays}');
app = app.replace(/label=\{\{ value: '[^']*מאמץ[^']*', angle: -90/g, "label={{ value: LABELS.axisEffort, angle: -90");
app = app.replace(/name="זמן טיפול"|name="[^"]*זמן[^"]*"/g, 'name={LABELS.axisTime}');

// Garbled quadrant texts - replace any text element with opacity 0.08 or 0.1 that has mojibake
app = app.replace(/<text x={75} y={38}[^>]+>[^<]+<\/text>/g, '<text x={75} y={38} fill="#ef4444" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qHandoff}</text>');
app = app.replace(/<text x={15} y={38}[^>]+>[^<]+<\/text>/g, '<text x={15} y={38} fill="#f59e0b" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qNiche}</text>');
app = app.replace(/<text x={75} y={8}[^>]+>[^<]+<\/text>/g, '<text x={75} y={8} fill="#10b981" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qBroad}</text>');
app = app.replace(/<text x={15} y={8}[^>]+>[^<]+<\/text>/g, '<text x={15} y={8} fill="#3b82f6" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qQuick}</text>');
app = app.replace(/<text x={75} y={38} fill="#ef4444" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={75} y={38} fill="#ef4444" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qHandoff}</text>');
app = app.replace(/<text x={15} y={38} fill="#f59e0b" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={15} y={38} fill="#f59e0b" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qNiche}</text>');
app = app.replace(/<text x={75} y={8} fill="#10b981" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={75} y={8} fill="#10b981" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qBroad}</text>');
app = app.replace(/<text x={15} y={8} fill="#3b82f6" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={15} y={8} fill="#3b82f6" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qQuick}</text>');

app = app.replace(/<Scatter\s+name="[^"]+"/g, '<Scatter name={LABELS.tasksName}');
app = app.replace(/formatter=\{\(value\) => `\$\{value\} ימים`/g, 'formatter={(value) => `${value} ${LABELS.days}`}');
app = app.replace(/formatter=\{\(value\) => `\$\{value\} ימ'/g, 'formatter={(value) => `${value} ${LABELS.dayShort}`}');

// Overview - find by structure
app = app.replace(/text-blue-600 text-xl leading-none">📊<\/span><\/div>\s*<h2 className="text-xl font-bold text-slate-800">[^<]+<\/h2>/, 'text-blue-600 text-xl leading-none">📊</span></div>\n                <h2 className="text-xl font-bold text-slate-800">{LABELS.overviewMain}</h2>');
app = app.replace(/overviewMainDesc not needed/, '');
// simpler - replace lines containing only garbled in h2 after blue icon
app = app.replace(/(<motion.div className="bg-blue-100[\s\S]*?<h2 className="text-xl font-bold text-slate-800">)[^<]+(<\/h2>)/, '$1{LABELS.overviewMain}$2'.replace('motion.div', 'motion.div'));

// Fix duplicate broken approach - read file and fix overview/fullscreen manually

app = app.replace(/\?\? [^\n{]+/g, (m) => {
  if (m.includes('3d') || m.includes('תלת') || m.includes('')) return '{LABELS.tab3d}';
  if (m.includes('2D')) return '{LABELS.tab2d}';
  return m;
});
app = app.replace(/\?\?\? [^\n{]+/g, '{LABELS.fullscreen}');
app = app.replace(/\? סגור[^\n]*/g, '{LABELS.closeFullscreen}');

fs.writeFileSync(appPath, app, 'utf8');
console.log('fix-app-lines done');
