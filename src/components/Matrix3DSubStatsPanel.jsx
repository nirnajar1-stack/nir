import React from 'react';
import { COLORS, LABELS } from '../data.js';
import { getIntensityClassification } from '../utils/intensity.js';
import { getQuadrantPlacementReason, QUADRANT_UI } from '../utils/matrix3dQuadrants.js';

function MonthCell({ month, fam, tasks }) {
  return (
    <div className="matrix-stats-month flex flex-col items-center border border-outline-variant/30 bg-surface-container-lowest px-2 py-2.5">
      <span className="text-[10px] font-bold text-on-surface-variant">{month}</span>
      <div className="mt-1.5 flex items-baseline gap-1 text-sm">
        <span className="font-black text-on-surface">{fam ?? 0}</span>
        <span className="text-on-surface-variant/60">/</span>
        <span className="font-black text-primary-dim">{tasks ?? 0}</span>
      </div>
      <span className="mt-1 text-[9px] font-medium text-on-surface-variant">
        {LABELS.spreadUniqueFamiliesShort} · {LABELS.tasks}
      </span>
    </div>
  );
}

function KpiCard({ label, value, hint, valueClass = 'text-on-surface' }) {
  return (
    <div className="matrix-stats-kpi flex flex-col items-center border border-outline-variant/30 bg-surface-container-low p-3 text-center">
      <span className="text-[10px] font-bold leading-tight text-on-surface-variant">{label}</span>
      <span className={`mt-1.5 text-2xl font-black leading-none ${valueClass}`}>{value}</span>
      <span className="mt-1 text-[9px] leading-tight text-on-surface-variant">{hint}</span>
    </div>
  );
}

function AxisRow({ axisLabel, axisColor, text }) {
  return (
    <li className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span
        className="shrink-0 self-start rounded-none px-1.5 py-0.5 text-[9px] font-bold"
        style={{
          color: axisColor,
          backgroundColor: `${axisColor}18`,
          border: `1px solid ${axisColor}40`,
        }}
      >
        {axisLabel}
      </span>
      <span className="text-[11px] leading-snug text-on-surface">{text}</span>
    </li>
  );
}

/** @param {{ item: object; onClose: () => void }} props */
export default function Matrix3DSubStatsPanel({ item, onClose }) {
  const months = LABELS.months;
  const monthly = [
    { month: months[0], fam: item.janF, tasks: item.janT },
    { month: months[1], fam: item.febF, tasks: item.febT },
    { month: months[2], fam: item.marF, tasks: item.marT },
    { month: months[3], fam: item.aprF, tasks: item.aprT },
  ];
  const totalFam = monthly.reduce((s, m) => s + (m.fam || 0), 0);
  const totalTasks = monthly.reduce((s, m) => s + (m.tasks || 0), 0);
  const intensity = getIntensityClassification(totalFam, totalTasks);
  const placement = getQuadrantPlacementReason(item);
  const quadrant = QUADRANT_UI.find((q) => q.id === placement.quadrantId);
  const categoryColor = COLORS[item.main];

  return (
    <div
      className="matrix-stats-panel pointer-events-auto absolute inset-y-0 start-0 z-40 flex w-[min(320px,90vw)] flex-col border-e border-outline-variant/40 bg-surface-container-lowest shadow-2xl"
      dir="rtl"
    >
      <header className="matrix-stats-header flex items-start justify-between gap-3 border-b border-outline-variant/35 bg-surface-container-low px-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-wide text-on-surface-variant">
            {LABELS.matrix3dStatsTitle}
          </p>
          <h3 className="mt-1 truncate text-lg font-extrabold leading-tight text-on-surface" title={item.sub}>
            {item.sub}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
              style={{ backgroundColor: categoryColor }}
            />
            <span style={{ color: categoryColor }}>{item.main}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 border border-outline-variant/50 bg-surface-container-lowest p-1.5 text-on-surface transition-colors hover:border-primary/40 hover:bg-primary-container/30"
          aria-label={LABELS.matrix3dStatsClose}
        >
          <span className="material-symbols-outlined text-lg leading-none">close</span>
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 custom-scrollbar">
        {quadrant && (
          <section
            className="matrix-stats-quadrant border px-3.5 py-3.5"
            style={{
              borderColor: `${quadrant.color}50`,
              backgroundColor: `color-mix(in srgb, ${quadrant.color} 12%, var(--color-surface-container-lowest))`,
            }}
          >
            <span className="text-[10px] font-bold text-on-surface-variant">{LABELS.matrix3dQuadrant}</span>
            <p className="mt-1 text-base font-extrabold leading-tight" style={{ color: quadrant.color }}>
              {quadrant.num}. {quadrant.label}
            </p>

            <div className="mt-3 border-t border-outline-variant/25 pt-3">
              <p className="text-xs font-extrabold text-on-surface">{LABELS.matrix3dWhyQuadrant}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-on-surface-variant">
                {placement.summary}
              </p>
              <ul className="mt-3 space-y-2.5">
                <AxisRow axisLabel={LABELS.matrix3dAxisSpread} axisColor="#ca8a04" text={placement.spreadLine} />
                <AxisRow axisLabel={LABELS.matrix3dAxisEffort} axisColor="#16a34a" text={placement.effortLine} />
                <AxisRow axisLabel={LABELS.matrix3dAxisVolume} axisColor="#2563eb" text={placement.volumeLine} />
              </ul>
            </div>
          </section>
        )}

        <section>
          <p className="mb-2 text-[10px] font-bold text-on-surface-variant">מדדי מיקום במטריצה</p>
          <div className="grid grid-cols-3 gap-2">
            <KpiCard label={LABELS.spreadUniqueFamilies} value={item.families} hint="ציר X" />
            <KpiCard label="SLA" value={item.sla} hint={LABELS.slaOpenTasksNote} />
            <KpiCard label={LABELS.tasks} value={item.tasks} hint="ציר Z" valueClass="text-primary-dim" />
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs font-extrabold text-on-surface">{LABELS.matrix3dStatsMonthly}</p>
          <div className="grid grid-cols-2 gap-2">
            {monthly.map((m) => (
              <MonthCell key={m.month} month={m.month} fam={m.fam} tasks={m.tasks} />
            ))}
          </div>
        </section>

        <section className="border border-outline-variant/30 bg-surface-container-low p-3.5">
          <p className="text-xs font-extrabold text-on-surface">
            {LABELS.intensityTitle}{' '}
            <span className="text-on-surface-variant">{intensity.label}</span>
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-on-surface-variant">{intensity.desc}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className={`matrix-stats-intensity rounded-none border p-3 text-center ${intensity.color}`}>
              <span className="block text-[10px] font-bold">{LABELS.ratioLabel}</span>
              <span className="mt-1 block text-xl font-black">{intensity.ratio}</span>
            </div>
            <div className="border border-outline-variant/30 bg-surface-container-lowest p-3 text-center">
              <span className="block text-[10px] font-bold text-on-surface-variant">{LABELS.totalLabel}</span>
              <span className="mt-1 block text-sm font-black text-on-surface">
                {totalTasks} {LABELS.tasks}
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold text-on-surface-variant">
                {totalFam} {LABELS.spreadUniqueFamilies}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
