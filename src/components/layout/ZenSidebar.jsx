import { LABELS } from '../../data.js';

const NAV = [
  { id: 'analytics', icon: 'analytics', label: 'ניתוח מענים' },
  { id: 'coordinators', icon: 'groups', label: 'מתכללים' },
];

export default function ZenSidebar({ section, onSectionChange }) {
  return (
    <aside className="fixed right-0 top-0 z-50 flex h-screen w-64 flex-col border-l border-outline-variant/10 bg-background px-6 py-12">
      <div className="mb-12">
        <h1 className="text-lg font-medium tracking-tight text-primary">{LABELS.appTitle}</h1>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
          לוח בקרה ניהולי
        </p>
      </div>

      <nav className="flex flex-grow flex-col gap-8">
        {NAV.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`zen-nav-item w-full text-right ${active ? 'zen-nav-item-active' : 'zen-nav-item-inactive'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface">מערכת מענים</p>
            <p className="text-[10px] tracking-tight text-on-surface-variant">פורטל ניהולי</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
