import { COLORS, LABELS } from '../../data.js';

export default function CategoryLegend({ className = '' }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 border border-outline-variant/15 bg-surface-container-low px-4 py-3 ${className}`}
      role="list"
      aria-label={LABELS.legend}
    >
      <span className="zen-label shrink-0">{LABELS.legend}</span>
      {Object.keys(COLORS).map((key) => (
        <div key={key} role="listitem" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[key] }} />
          <span className="text-xs font-medium text-on-surface">{key}</span>
        </div>
      ))}
    </div>
  );
}
