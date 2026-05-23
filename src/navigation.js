import { LABELS } from './data.js';

/** @typedef {{ id: string; label: string; icon: string }} NavItem */
/** @typedef {{ id: string; label: string; icon: string; items: NavItem[] }} NavGroup */

/** @type {NavGroup[]} */
export const NAV_GROUPS = [
  {
    id: 'methodology',
    label: 'מתודולוגיית ניתוח',
    icon: 'menu_book',
    items: [{ id: 'guide', label: 'מתודולוגיית הניתוח', icon: 'menu_book' }],
  },
  {
    id: 'coordinators',
    label: 'מתכללים',
    icon: 'groups',
    items: [
      { id: 'overview', label: 'תקציר ופעילות', icon: 'summarize' },
      { id: 'heatmap', label: 'פיזור עומסים', icon: 'grid_on' },
      { id: 'dna', label: 'DNA מתכללים', icon: 'hub' },
    ],
  },
  {
    id: 'analytics',
    label: 'ניתוח מענים',
    icon: 'analytics',
    items: [
      { id: 'intensity', label: 'פריסה, תפוצה ופילוח', icon: 'show_chart' },
      { id: 'spread', label: 'טבלת פיזור מורחבת', icon: 'table_chart' },
      { id: 'matrix-3d', label: 'מטריצת החלטות — 3D', icon: 'view_in_ar' },
      { id: 'matrix-2d', label: 'מטריצת החלטות — 2D', icon: 'scatter_plot' },
    ],
  },
  {
    id: 'services',
    label: 'מענים',
    icon: 'support_agent',
    items: [
      { id: 'cards', label: 'מרכז החלטות — כרטיסים', icon: 'grid_view' },
      { id: 'atlas', label: 'מרכז החלטות — מפת זירות', icon: 'view_sidebar' },
    ],
  },
  {
    id: 'development',
    label: 'פיתוח מענים',
    icon: 'auto_awesome',
    items: [{ id: 'hub', label: 'פיתוח ומיצוי מענים', icon: 'donut_large' }],
  },
];

export const DEFAULT_PAGE = 'methodology-guide';

const ALL_PAGE_IDS = NAV_GROUPS.flatMap((g) => g.items.map((i) => `${g.id}-${i.id}`));

export function isValidPageId(pageId) {
  return ALL_PAGE_IDS.includes(pageId);
}

/** @param {string} pageId e.g. "analytics-intensity" */
export function parsePageId(pageId) {
  const [group, ...rest] = pageId.split('-');
  return { group, sub: rest.join('-') };
}

/** @param {string} group @param {string} sub */
export function buildPageId(group, sub) {
  return `${group}-${sub}`;
}

/** @param {string} pageId */
export function getPageMeta(pageId) {
  const { group, sub } = parsePageId(pageId);
  const navGroup = NAV_GROUPS.find((g) => g.id === group);
  const item = navGroup?.items.find((i) => i.id === sub);

  let subtitle = '';
  if (group === 'methodology') subtitle = 'עקרונות הניתוח, Taxonomy, הגדרות מדדים ומבנה הלוח';
  else if (group === 'coordinators') subtitle = 'פילוח לפי מתכללים (ינואר)';
  else if (group === 'analytics') subtitle = LABELS.appSubtitle.split('(')[0].trim();
  else if (group === 'services') {
    subtitle =
      sub === 'atlas'
        ? 'תצוגת מפת זירות — ניווט רציף בין כל הנהלים'
        : 'תצוגת כרטיסים — זירות מענה והעתקת נהלים מוכנים';
  } else if (group === 'development') {
    subtitle =
      'מעטפת אזרחית סביב המשפחה — פיתוח דינמי של מענים ומיצוי אקטיבי של זכויות';
  }

  return {
    group,
    sub,
    groupLabel: navGroup?.label ?? group,
    pageLabel: item?.label ?? sub,
    subtitle,
  };
}
