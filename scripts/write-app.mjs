import { writeFileSync } from 'fs';

const D = 'div';
const content = `import { useState } from 'react';
import { COLORS, LABELS } from './data.js';
import AnalyticsView from './views/AnalyticsView.jsx';
import CoordinatorView from './views/CoordinatorView.jsx';

export default function App() {
  const [section, setSection] = useState('analytics');

  return (
    <${D} className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen font-sans selection:bg-indigo-200" dir="rtl">
      <${D} className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{LABELS.appTitle}</h1>
        <p className="text-slate-600 text-base md:text-lg">{LABELS.appSubtitle}</p>
      </${D}>

      <${D} className="flex justify-center mb-8">
        <${D} className="bg-slate-200/60 p-1.5 rounded-2xl flex border border-slate-300/40 shadow-sm flex-wrap justify-center gap-1">
          <button
            type="button"
            onClick={() => setSection('analytics')}
            className={\`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 \${section === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}\`}
          >
            {LABELS.sectionAnalytics}
          </button>
          <button
            type="button"
            onClick={() => setSection('coordinators')}
            className={\`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 \${section === 'coordinators' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}\`}
          >
            {LABELS.sectionCoordinators}
          </button>
        </${D}>
      </${D}>

      {section === 'analytics' ? <AnalyticsView /> : <CoordinatorView />}

      {section === 'analytics' && (
        <${D} className="mt-10 bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex flex-wrap gap-4 justify-center items-center max-w-4xl mx-auto">
          <span className="text-slate-500 font-medium text-sm border-l border-slate-200 pl-4 ml-2">{LABELS.legend}</span>
          {Object.keys(COLORS).map((key) => (
            <${D} key={key} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
              <${D} className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: COLORS[key] }} />
              <span className="text-sm text-slate-700 font-semibold">{key}</span>
            </${D}>
          ))}
        </${D}>
      )}
    </${D}>
  );
}
`;

writeFileSync('src/App.jsx', content);
