import { mainCategoryData, subCategoryData } from '../data/analyticsData.js';
import { categories, rawData } from '../data/coordinatorData.js';
import { ACTIVE_COORDINATORS, INACTIVE_COORDINATORS } from './coordinatorStats.js';

export function getAnalyticsKpis() {
  const totalFamilies = mainCategoryData.reduce((s, r) => s + r.families, 0);
  const totalTasks = subCategoryData.reduce((s, r) => s + (r.tasks || 0), 0);
  const avgSla =
    mainCategoryData.reduce((s, r) => s + r.avgSla * r.families, 0) / totalFamilies;
  return {
    totalFamilies,
    totalTasks,
    avgSla: avgSla.toFixed(1),
    categories: mainCategoryData.length,
  };
}

export function getCoordinatorKpis() {
  const totalTasks = rawData.reduce(
    (s, r) => s + r.values.reduce((a, b) => a + b, 0),
    0,
  );
  return {
    totalTasks,
    coordinators: ACTIVE_COORDINATORS.length + INACTIVE_COORDINATORS.length,
    activeCoordinators: ACTIVE_COORDINATORS.length,
    inactiveCoordinators: INACTIVE_COORDINATORS.length,
    categories: categories.length,
  };
}
