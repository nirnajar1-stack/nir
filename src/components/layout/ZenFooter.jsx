import { LABELS } from '../../data.js';

export default function ZenFooter() {
  return (
    <footer className="mt-16 grid grid-cols-12 items-center gap-8 border-t border-outline-variant/10 pt-8">
      <div className="col-span-12 flex flex-wrap gap-12 lg:col-span-8">
        <div>
          <p className="zen-label">מקור נתונים</p>
          <p className="text-sm font-semibold text-primary">{LABELS.appSubtitle.slice(0, 24)}…</p>
        </div>
        <div>
          <p className="zen-label">תקופה</p>
          <p className="text-sm font-semibold text-primary">ינואר – אפריל</p>
        </div>
        <div>
          <p className="zen-label">סטטוס</p>
          <p className="text-sm font-semibold text-primary">פעיל</p>
        </div>
      </div>
      <div className="col-span-12 text-left lg:col-span-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          מערכת ניתוח מענים © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
