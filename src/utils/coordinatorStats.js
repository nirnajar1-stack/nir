import { coordinators, categories, rawData } from '../data/coordinatorData.js';

/** מתכללים שסומנו כלא פעילים — תמיד מוצגים בסוף הרשימות */
export const INACTIVE_COORDINATORS = [
  'רוית דרזיה',
  'ענת אברהם',
  "יעל ג'ואל ליכטר",
  'מיכל ברמן',
  'רויטל אביאני',
  'לידיה פינק',
];

export function isCoordinatorActive(name) {
  return !INACTIVE_COORDINATORS.includes(name);
}

export function getCoordinatorTotals() {
  return coordinators.map((name, index) => ({
    name,
    index,
    total: rawData.reduce((sum, row) => sum + row.values[index], 0),
  }));
}

const totalsByName = Object.fromEntries(
  getCoordinatorTotals().map((c) => [c.name, c.total]),
);

/** מתכללים פעילים — ממוינים לפי נפח פעילות (גבוה → נמוך) */
export const ACTIVE_COORDINATORS = coordinators
  .filter((c) => isCoordinatorActive(c))
  .sort((a, b) => (totalsByName[b] ?? 0) - (totalsByName[a] ?? 0));

function compareByActivityThenMetric(a, b, metric) {
  if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
  return metric(b) - metric(a);
}

export function getOrgTotalTasks() {
  return rawData.reduce(
    (sum, row) => sum + row.values.reduce((a, b) => a + b, 0),
    0,
  );
}

export function getCoordinatorCategoryProfile(coordinatorName, sortedTasks = null) {
  const tasks = sortedTasks ?? rawData;
  const cIdx = coordinators.indexOf(coordinatorName);
  const orgTotal = getOrgTotalTasks();

  const byCategory = categories.map((cat) => {
    const value = tasks
      .filter((d) => d.main === cat)
      .reduce((sum, row) => sum + row.values[cIdx], 0);
    return { subject: cat, A: value };
  });

  const coordinatorTotal = byCategory.reduce((s, d) => s + d.A, 0);
  const radarData = byCategory.map((d) => ({
    ...d,
    pct: coordinatorTotal ? Math.round((d.A / coordinatorTotal) * 100) : 0,
    orgPct: orgTotal ? ((d.A / orgTotal) * 100).toFixed(1) : '0.0',
  }));

  const sorted = [...radarData].sort((a, b) => b.A - a.A);
  const top = sorted[0] ?? { subject: '—', A: 0, pct: 0 };

  return {
    radarData,
    coordinatorTotal,
    orgSharePct: orgTotal ? ((coordinatorTotal / orgTotal) * 100).toFixed(1) : '0.0',
    topCategory: top.subject,
    topCategoryCount: top.A,
    topCategoryPct: top.pct,
    pieData: radarData.filter((d) => d.A > 0).map((d) => ({ name: d.subject, value: d.A })),
  };
}

/** פירוט מענים (תתי־סיווג) למתכלל נבחר */
export function getCoordinatorServiceSpread(coordinatorName) {
  const cIdx = coordinators.indexOf(coordinatorName);
  return [...rawData]
    .map((row) => ({
      name: row.sub,
      main: row.main,
      value: row.values[cIdx],
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** לכל תחום — כל המתכללים מדורגים לפי נתח בתחום (פעילים קודם) */
export function getCategoryKnowledgeRoster() {
  return categories.map((cat) => {
    const catTotal = rawData
      .filter((d) => d.main === cat)
      .reduce((sum, row) => sum + row.values.reduce((a, b) => a + b, 0), 0);

    const roster = coordinators
      .map((name, index) => {
        const value = rawData
          .filter((d) => d.main === cat)
          .reduce((sum, row) => sum + row.values[index], 0);
        return {
          name,
          value,
          catPct: catTotal ? ((value / catTotal) * 100).toFixed(1) : '0.0',
          isActive: isCoordinatorActive(name),
        };
      })
      .filter((r) => r.value > 0)
      .sort((a, b) => compareByActivityThenMetric(a, b, (x) => x.value));

    return { category: cat, catTotal, roster };
  });
}

/** רשימת כל המתכללים עם חוזק ארגוני (פעילים קודם) */
export function getOrgKnowledgeHubList() {
  const orgTotal = getOrgTotalTasks();
  return getCoordinatorTotals()
    .map((c) => {
      const profile = getCoordinatorCategoryProfile(c.name);
      return {
        name: c.name,
        total: c.total,
        orgPct: orgTotal ? ((c.total / orgTotal) * 100).toFixed(1) : '0.0',
        isActive: isCoordinatorActive(c.name),
        topCategory: profile.topCategory,
        topCategoryPct: profile.topCategoryPct,
      };
    })
    .sort((a, b) => compareByActivityThenMetric(a, b, (x) => x.total));
}
