import { motion } from 'framer-motion';

const CX = 220;
const CY = 214;
const ORBIT_R = 162;

/** @param {number} i @param {number} n */
export function orbitPoint(i, n) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CX + Math.cos(a) * ORBIT_R,
    y: CY + Math.sin(a) * ORBIT_R,
    a,
  };
}

export { CX, CY, ORBIT_R };

/**
 * @param {{ activeIndex: number, total: number, colors: string[] }} props
 */
export default function FamilyOrbitSvg({ activeIndex, total, colors }) {
  const active = orbitPoint(activeIndex, total);
  const arcSpan = (Math.PI * 2) / total;
  const arcStart = active.a - arcSpan / 2;
  const arcEnd = active.a + arcSpan / 2;
  const arcPath = describeArc(CX, CY, ORBIT_R, arcStart, arcEnd);

  return (
    <svg
      viewBox="0 0 440 440"
      className="development-orbit-svg h-full w-full max-h-[min(440px,52vh)]"
      aria-hidden
    >
      <defs>
        <radialGradient id="devPaperWash" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#faf8f3" stopOpacity="1" />
          <stop offset="55%" stopColor="#f3f0e8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e8ecf4" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="devWarmCore" cx="50%" cy="44%" r="48%">
          <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.98" />
          <stop offset="42%" stopColor="#fde68a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#4f5e7f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="devOrbitStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f5e7f" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#4f5e7f" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#4f5e7f" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="devActiveArc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[activeIndex] ?? '#ca8a04'} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0.55" />
        </linearGradient>
        <filter id="devSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="440" height="440" fill="url(#devPaperWash)" rx="0" />

      {/* רשת עדינה */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`grid-h-${i}`}
          x1={40 + i * 40}
          y1={24}
          x2={40 + i * 40}
          y2={416}
          stroke="#4f5e7f"
          strokeWidth="0.35"
          opacity="0.06"
        />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`grid-v-${i}`}
          x1={24}
          y1={40 + i * 40}
          x2={416}
          y2={40 + i * 40}
          stroke="#4f5e7f"
          strokeWidth="0.35"
          opacity="0.06"
        />
      ))}

      {/* מעגלים קונצנטריים */}
      <circle cx={CX} cy={CY} r={ORBIT_R + 28} fill="none" stroke="url(#devOrbitStroke)" strokeWidth="0.75" />
      <circle cx={CX} cy={CY} r={ORBIT_R - 22} fill="none" stroke="#afb3ac" strokeWidth="0.5" opacity="0.22" />

      <motion.circle
        cx={CX}
        cy={CY}
        r={ORBIT_R}
        fill="none"
        stroke="#4f5e7f"
        strokeWidth="1.25"
        strokeDasharray="3 9"
        opacity="0.28"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* קשת פעילה */}
      <motion.path
        key={`arc-${activeIndex}`}
        d={arcPath}
        fill="none"
        stroke="url(#devActiveArc)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        filter="url(#devSoftGlow)"
      />

      {/* קווי חיבור */}
      {Array.from({ length: total }).map((_, i) => {
        const p = orbitPoint(i, total);
        const isActive = i === activeIndex;
        return (
          <line
            key={`spoke-${i}`}
            x1={CX}
            y1={CY}
            x2={p.x}
            y2={p.y}
            stroke={isActive ? colors[i] : '#afb3ac'}
            strokeWidth={isActive ? 1.75 : 0.65}
            opacity={isActive ? 0.45 : 0.12}
            strokeDasharray={isActive ? 'none' : '3 7'}
          />
        );
      })}

      <motion.line
        key={`beam-${activeIndex}`}
        x1={CX}
        y1={CY}
        x2={active.x}
        y2={active.y}
        stroke="#eab308"
        strokeWidth="2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.35 }}
      />

      {/* ליבה */}
      <circle cx={CX} cy={CY} r={68} fill="url(#devWarmCore)" />
      <circle cx={CX} cy={CY} r={70} fill="none" stroke="#ca8a04" strokeWidth="0.75" opacity="0.28" />

      {/* איור משפחה — קווי מתאר editorial */}
      <g transform={`translate(${CX - 56}, ${CY - 54})`} opacity="0.94">
        <ellipse cx="56" cy="108" rx="52" ry="8" fill="#4f5e7f" opacity="0.07" />
        <path
          d="M24 86c0-13 10-22 22-22s22 9 22 22v30H24V86z"
          fill="#445272"
          opacity="0.88"
        />
        <circle cx="46" cy="50" r="17" fill="#f0d5b8" />
        <path
          d="M72 90c0-11 8-20 18-20s18 9 18 20v26H72V90z"
          fill="#b86b7a"
          opacity="0.9"
        />
        <circle cx="90" cy="56" r="15" fill="#f0d5b8" />
        <path
          d="M6 104c0-7 5-12 11-12s11 5 11 12v14H6v-14z"
          fill="#6a9e8c"
          opacity="0.86"
        />
        <circle cx="17" cy="86" r="10" fill="#f0d5b8" />
        <path
          d="M98 106c0-6 4-10 9-10s9 4 9 10v12h-18v-12z"
          fill="#6a9e8c"
          opacity="0.86"
        />
        <circle cx="107" cy="90" r="9" fill="#f0d5b8" />
        <path
          d="M14 42 Q56 18 98 42"
          fill="none"
          stroke="#ca8a04"
          strokeWidth="2.25"
          strokeLinecap="round"
          opacity="0.42"
        />
        <circle cx="56" cy="34" r="3" fill="#eab308" opacity="0.55" />
      </g>

      {/* נקודות אווירה */}
      {[
        [88, 92], [352, 118], [118, 348], [330, 310], [72, 300],
      ].map(([x, y], i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={x}
          cy={y}
          r={2}
          fill="#4f5e7f"
          opacity="0.18"
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <text
        x={CX}
        y={CY + 96}
        textAnchor="middle"
        style={{ fontFamily: 'Heebo, sans-serif', fontSize: '10px', fontWeight: 700, fill: '#6b7280', letterSpacing: '0.08em' }}
      >
        משפחה · ליווי · שיקום
      </text>
    </svg>
  );
}

/** @param {number} cx @param {number} cy @param {number} r @param {number} start @param {number} end */
function describeArc(cx, cy, r, start, end) {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}
