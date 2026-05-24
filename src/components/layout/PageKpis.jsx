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
        <KpiCard
          label={LABELS.kpiFamilies}
          value={k.uniqueFamilies.toLocaleString('he-IL')}
          hint={k.uniqueFamiliesHint}
        />
        <KpiCard
          label={LABELS.kpiTasks}
          value={k.totalTasks.toLocaleString('he-IL')}
          hint={k.totalTasksHint}
        />
        <KpiCard
          label={LABELS.kpiSla}
          value={`${k.avgSla} ${LABELS.dayShort}`}
          hint={k.avgSlaHint}
        />
        <KpiCard
          label={LABELS.kpiSubCategories}
          value={k.subCategories}
          hint={`${k.mainCategories} קטגוריות ראשיות`}
        />
      </div>
    );
  }

  const k = getCoordinatorKpis();
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      <KpiCard label={LABELS.kpiTasks} value={k.totalTasks.toLocaleString('he-IL')} hint="ינואר" />
      <KpiCard
        label="מתכללים"
        value={`${k.activeCoordinators} פעילים · ${k.inactiveCoordinators} לא`}
        hint={`${k.coordinators} סה״כ`}
      />
      <KpiCard label="קטגוריות" value={k.categories} hint="סיווגים ראשיים" />
    </div>
  );
}
