import { motion } from 'framer-motion';
import { DEVELOPMENT_THEMES } from '../../data/developmentData.js';
import { LABELS } from '../../data.js';
import FamilyOrbitSvg, { orbitPoint } from './FamilyOrbitSvg.jsx';

/**
 * @param {{ activeIndex: number, onSelect: (i: number) => void }} props
 */
export default function DevelopmentOrbitMap({ activeIndex, onSelect }) {
  const n = DEVELOPMENT_THEMES.length;
  const colors = DEVELOPMENT_THEMES.map((t) => t.color);

  return (
    <motion.div
      className="development-orbit-stage relative mx-auto aspect-square w-full max-w-[440px]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <FamilyOrbitSvg activeIndex={activeIndex} total={n} colors={colors} />

      {DEVELOPMENT_THEMES.map((theme, i) => {
        const p = orbitPoint(i, n);
        const pctX = (p.x / 440) * 100;
        const pctY = (p.y / 440) * 100;
        const isActive = i === activeIndex;

        return (
          <motion.button
            key={theme.id}
            type="button"
            onClick={() => onSelect(i)}
            className={`development-orbit-node absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 border-0 bg-transparent p-0 outline-none ${
              isActive ? 'development-orbit-node--active' : ''
            }`}
            style={{ left: `${pctX}%`, top: `${pctY}%` }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            aria-label={theme.title}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className="development-orbit-node__dot relative flex h-10 w-10 items-center justify-center rounded-full md:h-11 md:w-11"
              style={{
                backgroundColor: isActive ? '#fffbeb' : theme.color,
                boxShadow: isActive
                  ? `0 0 0 3px ${theme.color}55, 0 10px 24px rgba(79, 94, 127, 0.22)`
                  : '0 4px 14px rgba(79, 94, 127, 0.18)',
              }}
            >
              <span
                className="material-symbols-outlined text-[17px] md:text-lg"
                style={{ color: isActive ? theme.color : '#fff' }}
              >
                {theme.icon}
              </span>
              <span
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-extrabold"
                style={{
                  backgroundColor: isActive ? theme.color : 'rgba(255,255,255,0.92)',
                  color: isActive ? '#fff' : theme.color,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </span>
            <span
              className={`max-w-[5rem] text-center text-[9px] font-bold leading-tight md:max-w-[5.5rem] md:text-[10px] ${
                isActive ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              {theme.shortLabel}
            </span>
          </motion.button>
        );
      })}

      <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-[10px] text-on-surface-variant/70">
        {LABELS.developmentRingHint}
      </p>
    </motion.div>
  );
}
