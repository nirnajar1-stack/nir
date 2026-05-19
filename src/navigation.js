import { LABELS } from './data.js';

/** @typedef {{ id: string; label: string; icon: string }} NavItem */
/** @typedef {{ id: string; label: string; icon: string; items: NavItem[] }} NavGroup */

/** @type {NavGroup[]} */
export const NAV_GROUPS = [
  {
    id: 'analytics',
    label: 'ניתוח מענים',
    icon: 'analytics',
    items: [
      { id: 'intensity', label: 'תפוצה לעומת עצימות', icon: 'show_chart' },
      { id: 'spread', label: 'טבלת פיזור מורחבת', icon: 'table_chart' },
      { id: 'matrix-3d', label: 'מטריצת החלטות — 3D', icon: 'view_in_ar' },
      { id: 'matrix-2d', label: 'מטריצת החלטות — 2D', icon: 'scatter_plot' },
      { id: 'overview', label: 'פילוח כללי', icon: 'pie_chart' },
    ],
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
];

export const DEFAULT_PAGE = 'analytics-intensity';

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
      group === 'analytics'
        ? LABELS.appSubtitle.split('(')[0].trim()
        : 'פילוח לפי מתכללים (ינואר)',
  };
}
