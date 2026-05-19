import { useState } from 'react';
import { LABELS } from '../../data.js';
import { NAV_GROUPS } from '../../navigation.js';

export default function ZenSidebar({ activePage, onPageChange }) {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(NAV_GROUPS.map((g) => [g.id, true])),
  );

  const activeGroup = activePage.split('-')[0];

  const toggleGroup = (groupId) => {
    setExpanded((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <aside className="fixed right-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-auto border-l border-outline-variant/10 bg-background px-5 py-10 custom-scrollbar">
      <div className="mb-10 shrink-0">
        <h1 className="text-base font-medium leading-snug tracking-tight text-primary">{LABELS.appTitle}</h1>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
          לוח בקרה ניהולי
        </p>
      </div>

      <nav className="flex flex-grow flex-col gap-6">
        {NAV_GROUPS.map((group) => {
          const isGroupActive = activeGroup === group.id;
          const isOpen = expanded[group.id] ?? true;

          return (
            <div key={group.id} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  toggleGroup(group.id);
                  if (!isGroupActive && group.items[0]) {
                    onPageChange(`${group.id}-${group.items[0].id}`);
                  }
                }}
                className={`flex w-full items-center justify-between gap-2 py-1 text-right transition-colors ${
                  isGroupActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[1.1rem]">{group.icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest">{group.label}</span>
                </span>
                <span
                  className={`material-symbols-outlined text-base transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="mr-1 flex flex-col gap-0.5 border-r-2 border-outline-variant/20 pr-3">
                  {group.items.map((item) => {
                    const pageId = `${group.id}-${item.id}`;
                    const isActive = activePage === pageId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onPageChange(pageId)}
                        className={`zen-nav-sub-item w-full text-right ${isActive ? 'zen-nav-sub-item-active' : 'zen-nav-sub-item-inactive'}`}
                      >
                        <span className="material-symbols-outlined text-[1rem]">{item.icon}</span>
                        <span className="leading-snug">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-8 shrink-0 border-t border-outline-variant/15 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="min-w-0 text-right">
            <p className="truncate text-[11px] font-bold uppercase tracking-widest text-on-surface">מערכת מענים</p>
            <p className="text-[10px] tracking-tight text-on-surface-variant">פורטל ניהולי</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
