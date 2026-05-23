import { LABELS } from '../data.js';

export const THRESHOLDS_3D = { families: 32, sla: 20 };

/** @typedef {'quick' | 'niche' | 'broad' | 'handoff'} QuadrantId */

/** @param {{ families: number; sla: number }} item */
export function getQuadrantForItem(item) {
  const highFam = item.families >= THRESHOLDS_3D.families;
  const highSla = item.sla >= THRESHOLDS_3D.sla;
  if (highFam && highSla) return 'handoff';
  if (highFam && !highSla) return 'broad';
  if (!highFam && highSla) return 'niche';
  return 'quick';
}

/** הסבר מיקום במטריצה — למה תת-הסיווג נופל ברביע זה */
export function getQuadrantPlacementReason(item) {
  const highFam = item.families >= THRESHOLDS_3D.families;
  const highSla = item.sla >= THRESHOLDS_3D.sla;
  const quadrantId = getQuadrantForItem(item);
  const famLabel = highFam ? 'גבוהה' : 'נמוכה';
  const slaLabel = highSla ? 'גבוה' : 'נמוך';

  const summaries = {
    quick: 'תפוצה נמוכה ומאמץ תפעולי נמוך — משימות «בזק» ללא עומס רוחבי.',
    niche: 'מאמץ גבוה (SLA ארוך) אך תפוצה מצומצמת — מומחיות נישה, לא עומס רחב.',
    broad: 'תפוצה רחבה (משפחות רבות) עם מאמץ נמוך יחסית — טיפול שוטף נרחב.',
    handoff: 'תפוצה רחבה ומאמץ גבוה יחד — מצביע על צורך בדיוק מענה והעברת שרביט לרפרנט.',
  };

  return {
    quadrantId,
    spreadLine: `${item.families} משפחות ייחודיות — תפוצה ${famLabel} (סף: ${THRESHOLDS_3D.families})`,
    effortLine: `${item.sla} ימי SLA — מאמץ ${slaLabel} (סף: ${THRESHOLDS_3D.sla} ימים)`,
    volumeLine: `${item.tasks} משימות בתקופה — גודל הכדור במרחב`,
    summary: summaries[quadrantId],
  };
}

/**
 * @param {number} xSplit
 * @param {number} ySplit
 * @returns {Record<QuadrantId, { min: {x:number,y:number,z:number}, max: {x:number,y:number,z:number}, center: {x:number,y:number,z:number} }>}
 */
export function buildQuadrantBounds(xSplit, ySplit) {
  const b = { min: -5, max: 5 };
  const center = (min, max) => ({
    x: (min.x + max.x) / 2,
    y: (min.y + max.y) / 2,
    z: (min.z + max.z) / 2,
  });

  return {
    quick: {
      min: { x: b.min, y: b.min, z: b.min },
      max: { x: xSplit, y: ySplit, z: b.max },
      center: center({ x: b.min, y: b.min, z: b.min }, { x: xSplit, y: ySplit, z: b.max }),
    },
    niche: {
      min: { x: b.min, y: ySplit, z: b.min },
      max: { x: xSplit, y: b.max, z: b.max },
      center: center({ x: b.min, y: ySplit, z: b.min }, { x: xSplit, y: b.max, z: b.max }),
    },
    broad: {
      min: { x: xSplit, y: b.min, z: b.min },
      max: { x: b.max, y: ySplit, z: b.max },
      center: center({ x: xSplit, y: b.min, z: b.min }, { x: b.max, y: ySplit, z: b.max }),
    },
    handoff: {
      min: { x: xSplit, y: ySplit, z: b.min },
      max: { x: b.max, y: b.max, z: b.max },
      center: center({ x: xSplit, y: ySplit, z: b.min }, { x: b.max, y: b.max, z: b.max }),
    },
  };
}

/** Camera orbit preset per quadrant (theta°, phi°, radius, lookAt offset from center) */
export const QUADRANT_UI = [
  {
    id: 'quick',
    num: 1,
    label: LABELS.qQuick,
    color: '#3b82f6',
    colorHex: 0x3b82f6,
    cam: { theta: 48, phi: 62, radius: 10.5 },
  },
  {
    id: 'niche',
    num: 2,
    label: LABELS.qNiche,
    color: '#f59e0b',
    colorHex: 0xf59e0b,
    cam: { theta: 28, phi: 52, radius: 10.5 },
  },
  {
    id: 'broad',
    num: 3,
    label: LABELS.qBroad,
    color: '#10b981',
    colorHex: 0x10b981,
    cam: { theta: 58, phi: 58, radius: 10.5 },
  },
  {
    id: 'handoff',
    num: 4,
    label: LABELS.qHandoff,
    color: '#eab308',
    colorHex: 0xeab308,
    cam: { theta: 42, phi: 46, radius: 9.5 },
  },
];

/** משך מעבר — מאוזן לסנכרון מצלמה + חללית */
export const TRAVEL_MS = 3800;
export const EXIT_TRAVEL_MS = 3200;

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
