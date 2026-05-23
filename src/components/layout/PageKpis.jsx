import { LABELS } from '../../data.js';
import { getAnalyticsKpis, getCoordinatorKpis } from '../../utils/kpiStats.js';

function KpiCard({ label, value, hint }) {
  return (
    <div className="zen-kpi-card">
      <p className="zen-label mb-2">{label}</p>
      <p className="text-2xl font-light tracking-wide text-on-surface">{value}</p>
      {hint ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </div>
  );
}

export default function PageKpis({ group }) {
  if (group === 'analytics') {
    const k = getAnalyticsKpis();
    return (
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard label={LABELS.kpiFamilies} value={k.totalFamilies.toLocaleString('he-IL')} hint="ינואר–אפריל" />
        <KpiCard label="סה״כ משימות" value={k.totalTasks.toLocaleString('he-IL')} hint="כל תתי הסיווג" />
        <KpiCard label="SLA ממוצע" value={`${k.avgSla} ימ׳`} hint="לפי קטגוריה ראשית" />
        <KpiCard label="קטגוריות" value={k.categories} hint="סיווגים ראשיים" />
      </div>
    );
  }

  const k = getCoordinatorKpis();
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      <KpiCard label="סה״כ משימות" value={k.totalTasks.toLocaleString('he-IL')} hint="ינואר" />
      <KpiCard
        label="מתכללים"
        value={`${k.activeCoordinators} פעילים · ${k.inactiveCoordinators} לא`}
        hint={`${k.coordinators} סה״כ`}
      />
      <KpiCard label="קטגוריות" value={k.categories} />
    </div>
  );
}
