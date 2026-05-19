import { useState } from 'react';
import { COLORS, LABELS } from './data.js';
import { DEFAULT_PAGE, getPageMeta } from './navigation.js';
import AnalyticsView from './views/AnalyticsView.jsx';
import CoordinatorView from './views/CoordinatorView.jsx';
import NewsTicker from './components/layout/NewsTicker.jsx';
import ZenSidebar from './components/layout/ZenSidebar.jsx';
import ZenHeader from './components/layout/ZenHeader.jsx';
import ZenFooter from './components/layout/ZenFooter.jsx';

export default function App() {
  const [activePage, setActivePage] = useState(DEFAULT_PAGE);
  const { group, sub, groupLabel, pageLabel, subtitle } = getPageMeta(activePage);

  return (
    <div className="min-h-screen bg-background text-on-background font-body" dir="rtl">
      <ZenSidebar activePage={activePage} onPageChange={setActivePage} />
      <ZenHeader />

      <main className="mr-72 min-h-screen">
        <div className="px-8 pb-12 pt-24 md:px-12">
          <NewsTicker />

          <div className="mb-10">
            <p className="zen-label mb-1">{groupLabel}</p>
            <h2 className="text-[1.75rem] font-medium tracking-[0.02em] text-on-surface">{pageLabel}</h2>
            <p className="mt-2 text-sm font-light tracking-wide text-on-surface-variant">{subtitle}</p>
          </div>

          <div className="animate-fadeIn">
            {group === 'analytics' ? (
              <AnalyticsView page={sub} />
            ) : (
              <CoordinatorView page={sub} />
            )}
          </div>

          {group === 'analytics' && (
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
