import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const p = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/App.jsx');
let app = fs.readFileSync(p, 'utf8');

app = app.replace(/label=\{\{ value: '[^']+', angle: -90/g, "label={{ value: LABELS.axisEffort, angle: -90");
app = app.replace(/<text x=\{75\} y=\{38\} fill="#ef4444" fontSize="18"[^>]+>[^<]+<\/text>/g, '<text x={75} y={38} fill="#ef4444" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qHandoff}</text>');
app = app.replace(/<text x=\{15\} y=\{38\} fill="#f59e0b" fontSize="18"[^>]+>[^<]+<\/text>/g, '<text x={15} y={38} fill="#f59e0b" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qNiche}</text>');
app = app.replace(/<text x=\{75\} y=\{8\} fill="#10b981" fontSize="18"[^>]+>[^<]+<\/text>/g, '<text x={75} y={8} fill="#10b981" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qBroad}</text>');
app = app.replace(/<text x=\{15\} y=\{8\} fill="#3b82f6" fontSize="18"[^>]+>[^<]+<\/text>/g, '<text x={15} y={8} fill="#3b82f6" fontSize="18" fontWeight="900" opacity="0.08">{LABELS.qQuick}</text>');
app = app.replace(/<text x=\{75\} y=\{38\} fill="#ef4444" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={75} y={38} fill="#ef4444" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qHandoff}</text>');
app = app.replace(/<text x=\{15\} y=\{38\} fill="#f59e0b" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={15} y={38} fill="#f59e0b" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qNiche}</text>');
app = app.replace(/<text x=\{75\} y=\{8\} fill="#10b981" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={75} y={8} fill="#10b981" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qBroad}</text>');
app = app.replace(/<text x=\{15\} y=\{8\} fill="#3b82f6" fontSize="24"[^>]+>[^<]+<\/text>/g, '<text x={15} y={8} fill="#3b82f6" fontSize="24" fontWeight="900" opacity="0.1">{LABELS.qQuick}</text>');
app = app.replace(/<p className="text-sm text-slate-500">[^<{]+10[^<{]+<\/p>/g, '<p className="text-sm text-slate-500">{LABELS.overviewSubDesc}</p>');
app = app.replace(/\? [^\n{]+סגור[^\n]*/g, '{LABELS.closeFullscreen}');
app = app.replace(/name="[^"]{4,}"/g, (m) => {
  if (m.includes('LABELS')) return m;
  if (m.includes('families') || m.includes('axisFamilies')) return 'name={LABELS.axisFamilies}';
  if (m.includes('ימי') || m.includes('sla')) return 'name={LABELS.axisDays}';
  if (m.includes('זמן')) return 'name={LABELS.axisTime}';
  return m;
});
app = app.replace(/label=\{\{ value: '[^']+', position: 'bottom'/g, "label={{ value: LABELS.axisSpread, position: 'bottom'");

fs.writeFileSync(p, app, 'utf8');
console.log('final app fixes done');
