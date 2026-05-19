import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'src/views/_coord_src.html'), 'utf8');

const brandStyles = html.match(/const brandStyles = `([\s\S]*?)`;/)[1];

const appStart = html.indexOf('const App = () => {');
const appEnd = html.lastIndexOf('export default App;');
let body = html.slice(appStart, appEnd);

// Remove lucide import block
body = body.replace(/import \{[\s\S]*?\} from 'lucide-react';\n\n/, '');

// Remove embedded data - use imports
body = body.replace(/const brandStyles = `[\s\S]*?`;\n\n/, '');
body = body.replace(/\/\/ --- מקור נתונים ---[\s\S]*?const BRAND_CHART_COLORS[\s\S]*?;\n\n/, '');

// Rename App to CoordinatorView
body = body.replace('const App = () => {', 'export default function CoordinatorView() {');

// Replace lucide components with emoji spans in JSX
const iconMap = [
  ['<ShieldCheck className="text-brand-yellow" size={28} />', '<span className="text-2xl">🛡️</span>'],
  ['<LayoutDashboard size={16} />', '<span>📊</span>'],
  ['<Grid3X3 size={16} />', '<span>🔲</span>'],
  ['<Dna size={16} />', '<span>🧬</span>'],
];
for (const [from, to] of iconMap) body = body.split(from).join(to);

// Remove outer wrapper header (brand header) - keep from first tab content
const tabOverview = body.indexOf("{/* --- טאב 1: מבט על");
const beforeTabs = body.indexOf('<nav className="flex gap-2">');
const headerEnd = body.indexOf('</header>', beforeTabs);
if (headerEnd > 0 && tabOverview > headerEnd) {
  const navOnly = `      <nav className="flex flex-wrap gap-2 mb-6 justify-center">
            <button onClick={() => setActiveTab('overview')} className={\`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 \${activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'}\`}>
              <span>📊</span> תקציר ופעילות
            </button>
            <button onClick={() => setActiveTab('heatmap')} className={\`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 \${activeTab === 'heatmap' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'}\`}>
              <span>🔲</span> פיזור עומסים
            </button>
            <button onClick={() => setActiveTab('dna')} className={\`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 \${activeTab === 'dna' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'}\`}>
              <span>🧬</span> DNA מתכללים
            </button>
          </nav>
`;
  body = body.slice(0, body.indexOf('return (')) + 
    'return (\n    <>\n      <style>{brandStyles}</style>\n      <div className="font-assistant">\n' + navOnly + '\n' + body.slice(tabOverview);
}

// Fix return wrapper - remove min-h-screen outer from coordinator
body = body.replace(
  /<div className="min-h-screen bg-bg-main[\s\S]*?<div className="max-w-\[1400px\] mx-auto">/,
  '<div className="max-w-[1400px] mx-auto">'
);
body = body.replace(/<style>\{brandStyles\}<\/style>\s*/, '');
body = body.replace(/<header className="mb-6[\s\S]*?<\/header>\s*/, '');

// material-symbols to emoji
body = body.replace(/<span className="material-symbols-outlined[^"]*">analytics<\/span>/g, '<span className="text-xl">📈</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">grid_view<\/span>/g, '<span className="text-xl">🔲</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">fingerprint<\/span>/g, '<span className="text-xl">🧬</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">person<\/span>/g, '<span>👤</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">account_tree<\/span>/g, '<span>🌳</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">data_alert<\/span>/g, '<span>⚠️</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">lightbulb<\/span>/g, '<span>💡</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">tips_and_updates<\/span>/g, '<span>💡</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">arrow_upward<\/span>/g, '<span>⬆️</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">arrow_downward<\/span>/g, '<span>⬇️</span>');
body = body.replace(/<span className="material-symbols-outlined[^"]*">workspace_premium<\/span>/g, '<span>🏆</span>');

// Close extra divs at end
body = body.replace(/\s*<\/div>\s*<\/motionless>\s*\);\s*\};/, '\n      </div>\n    </>\n  );\n}');
body = body.replace(/<\/div>\s*\);\s*\};\s*$/, '\n      </div>\n    </>\n  );\n}');

const imports = `import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, LabelList, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, Treemap, PolarRadiusAxis,
} from 'recharts';
import { coordinators, categories, rawData, BRAND_CHART_COLORS } from '../data.js';

const brandStyles = \`${brandStyles}\`;

const CustomTreemapContent = (props) => {
  const { x, y, width, height, index, name } = props;
  const safeName = typeof name === 'string' ? name : (name ? String(name) : '');
  const isLightBg = (index % BRAND_CHART_COLORS.length === 1) || (index % BRAND_CHART_COLORS.length === 3);
  const textColor = isLightBg ? '#002855' : '#ffffff';
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length],
          stroke: '#f0f5fa',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 60 && height > 30 && safeName ? (
        <text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle" fill={textColor} fontSize={13} fontWeight="bold">
          {safeName.length > 18 ? safeName.substring(0, 18) + '...' : safeName}
        </text>
      ) : null}
    </g>
  );
};

const renderPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#002855" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight="bold">
      {\`\${name} (\${(percent * 100).toFixed(0)}%)\`}
    </text>
  );
};

`;

let out = imports + body;
out = out.split('motionless').join('div');
// Fix duplicate export
out = out.replace(/export default function CoordinatorView[\s\S]*export default function CoordinatorView/, 'export default function CoordinatorView');

writeFileSync(join(root, 'src/views/CoordinatorView.jsx'), out);
console.log('Wrote CoordinatorView', out.length);
