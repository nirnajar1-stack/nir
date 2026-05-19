import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, 'src/App.jsx');
let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes('LABELS')) {
  app = app.replace(
    "import { mainCategoryData, subCategoryData, COLORS } from './data.js';",
    "import { mainCategoryData, subCategoryData, COLORS, LABELS } from './data.js';"
  );
}

app = app.replace(
  /const \[categoryFilter, setCategoryFilter\] = useState\([^)]+\);/,
  'const [categoryFilter, setCategoryFilter] = useState(LABELS.all);'
);
app = app.replace(
  /const matchesFilter = categoryFilter === [^|]+ \|\| item\.main === categoryFilter;/,
  'const matchesFilter = categoryFilter === LABELS.all || item.main === categoryFilter;'
);
app = app.replace(
  /const trendChartData = selectedSubCategory \? \[[\s\S]*?\] : \[\];/,
  `const trendChartData = selectedSubCategory ? [
    { month: LABELS.months[0], count: selectedSubCategory.jan },
    { month: LABELS.months[1], count: selectedSubCategory.feb },
    { month: LABELS.months[2], count: selectedSubCategory.mar },
    { month: LABELS.months[3], count: selectedSubCategory.apr },
  ] : [];`
);

const headerBlock = /      <div className="mb-8 text-center max-w-3xl mx-auto">[\s\S]*?      <\/div>\s*\n\s*      \{\/\* --- Main Navigation/;
app = app.replace(
  headerBlock,
  `      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{LABELS.title}</h1>
        <p className="text-slate-600 text-base md:text-lg">{LABELS.subtitle}</p>
      </div>

      {/* --- Main Navigation`
);

app = app.replace(
  /onClick=\{\(\) => setActiveMainTab\('continuity'\)\}[\s\S]*?<\/button>/,
  `onClick={() => setActiveMainTab('continuity')}
            className={\`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 \${activeMainTab === 'continuity' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}\`}
          >
            {LABELS.tabContinuity}
          </button>`
);
app = app.replace(
  /onClick=\{\(\) => setActiveMainTab\('matrix'\)\}[\s\S]*?<\/button>/,
  `onClick={() => setActiveMainTab('matrix')}
            className={\`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 \${activeMainTab === 'matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}\`}
          >
            {LABELS.tabMatrix}
          </button>`
);
app = app.replace(
  /onClick=\{\(\) => setActiveMainTab\('overview'\)\}[\s\S]*?<\/button>/,
  `onClick={() => setActiveMainTab('overview')}
            className={\`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 \${activeMainTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}\`}
          >
            {LABELS.tabOverview}
          </button>`
);
app = app.replace(/\?\?\s*[^\n<]+תלת-מימד[^\n<]*/g, '{LABELS.tab3d}');
app = app.replace(/\?\?\s*[^\n<]*דו-מימד \(2D\)/g, '{LABELS.tab2d}');
app = app.replace(/\?\?\?\s*מסך מלא/g, '{LABELS.fullscreen}');
app = app.replace(/\?\s*סגור מסך מלא/g, '{LABELS.closeFullscreen}');
app = app.replace(
  /<span className="text-slate-500 font-medium text-sm border-l border-slate-200 pl-4 ml-2">[^<]+<\/span>/,
  '<span className="text-slate-500 font-medium text-sm border-l border-slate-200 pl-4 ml-2">{LABELS.legend}</span>'
);

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

for (const [from, to] of emojiFixes) {
  app = app.split(from).join(to);
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('App.jsx patched');
