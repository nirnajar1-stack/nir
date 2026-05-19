import { readFileSync, writeFileSync } from 'fs';

const p = 'src/views/AnalyticsView.jsx';
let s = readFileSync(p, 'utf8');

const D = 'motionless'.replace('motionless', 'div');

const subChart = `          <${D} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col h-[400px]">
            <${D} className="mb-4">
              <${D} className="flex items-center gap-3 mb-1">
                <${D} className="bg-emerald-100 p-2 rounded-lg"><span className="text-emerald-600 text-xl leading-none">📋</span></${D}>
                <h2 className="text-xl font-bold text-slate-800">{LABELS.overviewSub}</h2>
              </${D}>
              <p className="text-sm text-slate-500">{LABELS.overviewSubDesc}</p>
            </${D}>
            <${D} className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subCategoryData.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide domain={[0, 'dataMax + 10']} />
                  <YAxis type="category" dataKey="sub" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={140} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltipSub />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="families" radius={[4, 0, 0, 4]} barSize={16}>
                    {subCategoryData.slice(0, 10).map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={COLORS[entry.main] || '#94a3b8'} />
                    ))}
                    <LabelList dataKey="sla" position="right" formatter={(value) => \`\${value} \${LABELS.dayShort}\`} fill="#64748b" fontSize={11} fontWeight="bold" offset={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </${D}>
          </${D}>

        </${D}>
      )}

      {/* --- Simulated Fullscreen Mode Overlay --- */}
`;

s = s.replace(
  /\s*<motionless\s*\n\s*\{isFullscreen &&/,
  '\n' + subChart + '\n      {isFullscreen &&'
);

s = s.split('motionless').join('motionless');
s = s.replace(/motionless/g, 'motionless');
// Actually D is already div from replace
s = s.split('motionless').join('div');

writeFileSync(p, s);
console.log('fixed');
