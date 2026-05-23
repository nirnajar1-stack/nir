import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DEVELOPMENT_THEMES } from '../data/developmentData.js';
import { LABELS } from '../data.js';
import DevelopmentOrbitMap from '../components/development/DevelopmentOrbitMap.jsx';
import DevelopmentDetailPanel from '../components/development/DevelopmentDetailPanel.jsx';

const PILLARS = [
  { id: 'develop', label: 'פיתוח', desc: 'מענה לפערים', icon: 'hub', accent: '#059669' },
  { id: 'exploit', label: 'מיצוי', desc: 'Push זכויות', icon: 'campaign', accent: '#ca8a04' },
];

export default function DevelopmentView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = DEVELOPMENT_THEMES[activeIndex];

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + DEVELOPMENT_THEMES.length) % DEVELOPMENT_THEMES.length);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % DEVELOPMENT_THEMES.length);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  return (
    <motion.div className="development-page space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.header
        className="development-hero relative overflow-hidden border border-outline-variant/15 bg-surface-container-lowest px-6 py-7 md:px-10 md:py-9"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-container/35 blur-3xl"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-tertiary-container/40 blur-3xl"
          aria-hidden
        />

        <motion.div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div className="max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
              {LABELS.developmentEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-on-surface md:text-[1.75rem]">
              {LABELS.developmentPageTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-[15px]">
              {LABELS.developmentPageIntro}
            </p>
          </motion.div>

          <motion.div className="flex shrink-0 gap-2">
            {PILLARS.map((p) => (
              <div
                key={p.id}
                className="development-pillar flex items-center gap-2.5 border border-outline-variant/20 bg-surface-container-low px-4 py-3"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center"
                  style={{ backgroundColor: `${p.accent}18`, color: p.accent }}
                >
                  <span className="material-symbols-outlined text-xl">{p.icon}</span>
                </span>
                <div>
                  <p className="text-sm font-bold text-on-surface">{p.label}</p>
                  <p className="text-[10px] text-on-surface-variant">{p.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.header>

      <motion.section
        className="development-stage grid gap-0 overflow-hidden border border-outline-variant/15 bg-surface-container-lowest shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
      >
        <div className="development-stage__visual relative flex flex-col items-center justify-center border-b border-outline-variant/15 px-4 py-10 md:px-8 lg:border-b-0 lg:border-l">
          <p className="mb-5 text-center text-xs font-semibold tracking-wide text-on-surface-variant">
            {LABELS.developmentOrbitCaption}
          </p>
          <DevelopmentOrbitMap activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>

        <motion.div
          className="development-stage__detail min-h-[440px]"
          key={theme.id}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DevelopmentDetailPanel
            theme={theme}
            activeIndex={activeIndex}
            total={DEVELOPMENT_THEMES.length}
            onPrev={goPrev}
            onNext={goNext}
          />
        </motion.div>
      </motion.section>

      <motion.nav
        className="development-timeline flex gap-2 overflow-x-auto pb-1"
        aria-label={LABELS.developmentTimelineLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {DEVELOPMENT_THEMES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`development-timeline__item shrink-0 border px-3 py-2.5 text-right transition ${
              i === activeIndex
                ? 'border-primary bg-primary text-on-primary shadow-sm'
                : 'border-outline-variant/25 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
            }`}
            style={
              i === activeIndex
                ? undefined
                : { borderRightColor: i === activeIndex ? undefined : `${t.color}44` }
            }
          >
            <span className="block text-[10px] font-bold opacity-70">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="block text-xs font-semibold">{t.shortLabel}</span>
          </button>
        ))}
      </motion.nav>
    </motion.div>
  );
}
