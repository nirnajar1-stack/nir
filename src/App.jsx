import { useState } from 'react';
import { getPageMeta } from './navigation.js';
import { useHashPage } from './hooks/useHashPage.js';
import AnalyticsView from './views/AnalyticsView.jsx';
import CoordinatorView from './views/CoordinatorView.jsx';
import MethodologyView from './views/MethodologyView.jsx';
import NewsTicker from './components/layout/NewsTicker.jsx';
import ZenSidebar from './components/layout/ZenSidebar.jsx';
import ZenHeader from './components/layout/ZenHeader.jsx';
import ZenFooter from './components/layout/ZenFooter.jsx';
import Breadcrumbs from './components/layout/Breadcrumbs.jsx';
import PageKpis from './components/layout/PageKpis.jsx';
import CategoryLegend from './components/charts/CategoryLegend.jsx';

const DATA_UPDATED = '19.05.2026';

export default function App() {
  const [activePage, setActivePage] = useHashPage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { group, sub, pageLabel, subtitle } = getPageMeta(activePage);

  return (
    <div className="min-h-screen bg-background text-on-background font-body" dir="rtl">
      <a href="#main-content" className="zen-skip-link">
        דלג לתוכן
      </a>

      <ZenSidebar
        activePage={activePage}
        onPageChange={setActivePage}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <ZenHeader onMenuOpen={() => setMobileNavOpen(true)} />

      <main id="main-content" className="mr-0 min-h-screen lg:mr-72">
        <div className="px-4 pb-12 pt-20 md:px-8 md:pt-24 lg:px-12">
          <NewsTicker />

          <Breadcrumbs activePage={activePage} />

          <header className="mb-6 max-w-3xl">
            <h1 className="text-2xl font-medium tracking-tight text-on-surface md:text-[1.75rem]">{pageLabel}</h1>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{subtitle}</p>
            <p className="mt-1 text-xs text-outline-variant">
              עודכן לאחרונה: {DATA_UPDATED}
            </p>
          </header>

          {sub !== 'methodology' && <PageKpis group={group} />}

          {group === 'analytics' && sub !== 'methodology' && (
            <CategoryLegend className="mb-6" />
          )}

          <div className="animate-fadeIn">
            {group === 'analytics' && sub === 'methodology' ? (
              <MethodologyView />
            ) : group === 'analytics' ? (
              <AnalyticsView page={sub} />
            ) : (
              <CoordinatorView page={sub} />
            )}
          </div>

          <ZenFooter />
        </div>
      </main>
    </div>
  );
}
