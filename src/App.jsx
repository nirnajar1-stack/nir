import { useState } from 'react';
import { COLORS, LABELS } from './data.js';
import AnalyticsView from './views/AnalyticsView.jsx';
import CoordinatorView from './views/CoordinatorView.jsx';
import NewsTicker from './components/layout/NewsTicker.jsx';
import ZenSidebar from './components/layout/ZenSidebar.jsx';
import ZenHeader from './components/layout/ZenHeader.jsx';
import ZenFooter from './components/layout/ZenFooter.jsx';

export default function App() {
  const [section, setSection] = useState('analytics');

  return (
    <div className="min-h-screen bg-background text-on-background font-body" dir="rtl">
      <ZenSidebar section={section} onSectionChange={setSection} />
      <ZenHeader />

      <main className="mr-64 min-h-screen">
        <div className="px-8 pb-12 pt-24 md:px-12">
          <NewsTicker />

          <div className="mb-10">
            <h2 className="text-[1.75rem] font-medium tracking-[0.02em] text-on-surface">{LABELS.appTitle}</h2>
            <p className="mt-2 text-sm font-light tracking-wide text-on-surface-variant">{LABELS.appSubtitle}</p>
          </div>

          <div className="animate-fadeIn">
            {section === 'analytics' ? <AnalyticsView /> : <CoordinatorView />}
          </div>

          {section === 'analytics' && (
            <div className="zen-card mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-4 border border-outline-variant/15">
              <span className="zen-label border-l border-outline-variant/30 pl-4">{LABELS.legend}</span>
              {Object.keys(COLORS).map((key) => (
                <div
                  key={key}
                  className="flex cursor-default items-center gap-2 px-2 py-1 transition-colors hover:bg-surface-container-high"
                >
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[key] }} />
                  <span className="text-sm font-medium text-on-surface">{key}</span>
                </div>
              ))}
            </div>
          )}

          <ZenFooter />
        </div>
      </main>
    </div>
  );
}
