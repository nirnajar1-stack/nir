import { useState } from 'react';
import { motion } from 'framer-motion';
import { getPageMeta } from './navigation.js';
import { useHashPage } from './hooks/useHashPage.js';
import AnalyticsView from './views/AnalyticsView.jsx';
import CoordinatorView from './views/CoordinatorView.jsx';
import MethodologyView from './views/MethodologyView.jsx';
import ServicesViewCards from './views/ServicesViewCards.jsx';
import ServicesViewAtlas from './views/ServicesViewAtlas.jsx';
import DevelopmentView from './views/DevelopmentView.jsx';
import NewsTicker from './components/layout/NewsTicker.jsx';
import ZenSidebar from './components/layout/ZenSidebar.jsx';
import ZenHeader from './components/layout/ZenHeader.jsx';
import ZenFooter from './components/layout/ZenFooter.jsx';
import Breadcrumbs from './components/layout/Breadcrumbs.jsx';
import PageKpis from './components/layout/PageKpis.jsx';
import CategoryLegend from './components/charts/CategoryLegend.jsx';
import PageTransition, { pageItemVariants } from './components/layout/PageTransition.jsx';

const DATA_UPDATED = '19.05.2026';

function renderPageContent(group, sub) {
  if (group === 'methodology') return <MethodologyView />;
  if (group === 'services') {
    return sub === 'atlas' ? <ServicesViewAtlas /> : <ServicesViewCards />;
  }
  if (group === 'analytics') return <AnalyticsView page={sub} />;
  if (group === 'development') return <DevelopmentView />;
  return <CoordinatorView page={sub} />;
}

const SHOW_KPIS = (group, sub) => {
  if (group === 'coordinators') return true;
  if (group === 'analytics' && sub !== 'spread') return true;
  return false;
};
const SHOW_LEGEND = (group, sub) => group === 'analytics' && sub !== 'spread';

export default function App() {
  const [activePage, setActivePage] = useHashPage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { group, sub, pageLabel, subtitle } = getPageMeta(activePage);

  return (
    <motion.div className="min-h-screen bg-background text-on-background font-body" dir="rtl">
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
        <motion.div className="px-4 pb-12 pt-20 md:px-8 md:pt-24 lg:px-12">
          <NewsTicker />

          <PageTransition pageKey={group} className="page-shell">
            <motion.div variants={pageItemVariants}>
              <Breadcrumbs activePage={activePage} />
            </motion.div>

            <PageTransition pageKey={activePage}>
              <motion.header variants={pageItemVariants} className="mb-6 max-w-3xl">
                <h1 className="text-2xl font-medium tracking-tight text-on-surface md:text-[1.75rem]">
                  {pageLabel}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{subtitle}</p>
                <p className="mt-1 text-xs text-outline-variant">עודכן לאחרונה: {DATA_UPDATED}</p>
              </motion.header>

              {SHOW_KPIS(group, sub) && (
                <motion.div variants={pageItemVariants}>
                  <PageKpis group={group} />
                </motion.div>
              )}

              {SHOW_LEGEND(group, sub) && (
                <motion.div variants={pageItemVariants}>
                  <CategoryLegend className="mb-6" />
                </motion.div>
              )}

              <motion.div variants={pageItemVariants} className="min-h-[200px]">
                {renderPageContent(group, sub)}
              </motion.div>
            </PageTransition>
          </PageTransition>

          <ZenFooter />
        </motion.div>
      </main>
    </motion.div>
  );
}
