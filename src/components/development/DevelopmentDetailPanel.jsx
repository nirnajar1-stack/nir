import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAMILY_HUB } from '../../data/developmentData.js';
import { LABELS } from '../../data.js';

/**
 * @param {{ theme: object, activeIndex: number, total: number, onPrev: () => void, onNext: () => void }} props
 */
export default function DevelopmentDetailPanel({
  theme,
  activeIndex,
  total,
  onPrev,
  onNext,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [theme.id]);

  const [lead, ...rest] = theme.paragraphs;

  return (
    <motion.div className="development-detail flex h-full min-h-[380px] flex-col overflow-hidden border-0 bg-surface-container-lowest">
      <motion.div
        className="h-1 shrink-0"
        style={{ backgroundColor: theme.color }}
        layoutId="dev-accent-bar"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <header className="shrink-0 border-b border-outline-variant/15 bg-surface-container-low px-6 py-5 md:px-8 md:py-6">
            <p className="text-[11px] font-bold tracking-[0.12em] text-outline-variant uppercase">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              {' · '}
              {LABELS.developmentContentLabel}
            </p>
            <motion.div
              className="mt-3 flex items-start gap-3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center"
                style={{ backgroundColor: `${theme.color}18`, color: theme.color }}
              >
                <span className="material-symbols-outlined text-2xl">{theme.icon}</span>
              </span>
              <div>
                <h3 className="text-xl font-extrabold leading-snug text-on-surface md:text-2xl">
                  {theme.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium" style={{ color: theme.color }}>
                  {theme.tagline}
                </p>
              </div>
            </motion.div>
          </header>

          <div
            ref={scrollRef}
            className="development-content-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6"
          >
            <div className="space-y-4">
              {lead && (
                <p className="development-lead text-[16px] font-medium leading-[1.8] text-on-surface md:text-[17px]">
                  {lead}
                </p>
              )}
              {rest.map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="text-[15px] leading-[1.75] text-on-surface-variant"
                >
                  {p}
                </p>
              ))}
              {theme.bullets.length > 0 && (
                <ul className="space-y-2.5 border-r-[3px] pr-4" style={{ borderColor: `${theme.color}88` }}>
                  {theme.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 text-sm leading-relaxed text-on-surface-variant"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: theme.color }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <footer className="shrink-0 border-t border-outline-variant/15 bg-surface-container-low px-6 py-3 md:px-8">
            <p className="text-xs leading-relaxed text-on-surface-variant">
              <span className="font-bold text-on-surface">{FAMILY_HUB.title}</span>
              {' — '}
              {FAMILY_HUB.description}
            </p>
          </footer>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="flex shrink-0 items-center justify-between border-t border-outline-variant/15 bg-surface-container px-4 py-2.5 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:text-primary"
        >
          <span className="material-symbols-outlined text-lg">north</span>
          {LABELS.developmentNavUp}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:text-primary"
        >
          {LABELS.developmentNavDown}
          <span className="material-symbols-outlined text-lg">south</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
