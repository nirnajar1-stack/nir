import { LABELS } from './data.js';

/** @typedef {{ id: string; label: string; icon: string }} NavItem */
/** @typedef {{ id: string; label: string; icon: string; items: NavItem[] }} NavGroup */

/** @type {NavGroup[]} */
export const NAV_GROUPS = [
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
      { id: 'methodology', label: 'מתודולוגיית ניתוח', icon: 'menu_book' },
      { id: 'intensity', label: 'תפוצה לעומת עצימות', icon: 'show_chart' },
      { id: 'spread', label: 'טבלת פיזור מורחבת', icon: 'table_chart' },
      { id: 'matrix-3d', label: 'מטריצת החלטות — 3D', icon: 'view_in_ar' },
      { id: 'matrix-2d', label: 'מטריצת החלטות — 2D', icon: 'scatter_plot' },
      { id: 'overview', label: 'פילוח כללי', icon: 'pie_chart' },
    ],
  },
];

export const DEFAULT_PAGE = 'analytics-methodology';

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
  return {
    group,
    sub,
    groupLabel: navGroup?.label ?? group,
    pageLabel: item?.label ?? sub,
    subtitle:
      sub === 'methodology'
        ? 'עקרונות הניתוח, הגדרות מדדים והסבר על מבנה הלוח'
        : group === 'analytics'
          ? LABELS.appSubtitle.split('(')[0].trim()
          : 'פילוח לפי מתכללים (ינואר)',
  };
}
