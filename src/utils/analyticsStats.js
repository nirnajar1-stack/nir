import { mainCategoryData, subCategoryData } from '../data/analyticsData.js';
import { LABELS } from '../data.js';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr'];

/** סיכום חודשי — משפחות ייחודיות ומשימות לפי תתי-סיווג */
export function getMonthlyTotals() {
  return MONTH_KEYS.map((key, i) => ({
    monthKey: key,
    month: LABELS.months[i],
    families: subCategoryData.reduce((s, row) => s + (row[`${key}F`] || 0), 0),
    tasks: subCategoryData.reduce((s, row) => s + (row[`${key}T`] || 0), 0),
  }));
}

/**
 * KPIs לעמודי אנליטיקס — לא מסכמים משפחות בין קטגוריות (כפילות).
 * משפחות: שיא חודשי · משימות: סה״כ תקופה · SLA: משוקלל לפי נפח משימות.
 */
export function getAnalyticsKpis() {
  const monthly = getMonthlyTotals();
  const totalTasks = subCategoryData.reduce((s, row) => s + (row.tasks || 0), 0);

  const avgSla =
    subCategoryData.reduce((s, row) => s + row.sla * (row.tasks || 0), 0) / totalTasks;

  const peakFamiliesMonth = monthly.reduce((best, m) =>
    m.families > best.families ? m : best,
  );
  const avgMonthlyFamilies = Math.round(
    monthly.reduce((s, m) => s + m.families, 0) / monthly.length,
  );

  return {
    /** שיא משפחות ייחודיות בחודש בודד (לא סכום קטגוריות — 548) */
    uniqueFamilies: peakFamiliesMonth.families,
    uniqueFamiliesHint: `שיא חודשי · ${peakFamiliesMonth.month}`,
    avgMonthlyFamilies,
    totalTasks,
    totalTasksHint: 'ינואר–אפריל · כל תתי הסיווג',
    avgSla: avgSla.toFixed(1),
    avgSlaHint: 'משוקלל לפי נפח משימות',
    subCategories: subCategoryData.length,
    mainCategories: mainCategoryData.length,
  };
}
