import { categories, rawData } from '../data/coordinatorData.js';
import { ACTIVE_COORDINATORS, INACTIVE_COORDINATORS } from './coordinatorStats.js';
import { getAnalyticsKpis } from './analyticsStats.js';

export { getAnalyticsKpis };

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
