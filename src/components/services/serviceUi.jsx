import { useCallback, useMemo, useState } from 'react';
import { SERVICE_FILTERS, SERVICE_ZONES } from '../../data/servicesData.js';

/** @type {Record<string, { stripe: string; wash: string; iconWrap: string; num: string }>} */
export const ZONE_TONES = {
  auth: { stripe: '#4f5e7f', wash: 'bg-primary-container/45', iconWrap: 'bg-primary text-on-primary', num: 'text-primary' },
  finance: { stripe: '#15803d', wash: 'bg-emerald-100/80', iconWrap: 'bg-emerald-700 text-white', num: 'text-emerald-800' },
  medical: { stripe: '#ca8a04', wash: 'bg-yellow-50/90', iconWrap: 'bg-yellow-600 text-white', num: 'text-yellow-800' },
  transport: { stripe: '#b45309', wash: 'bg-amber-50/90', iconWrap: 'bg-amber-600 text-white', num: 'text-amber-800' },
  resilience: { stripe: '#6b21a8', wash: 'bg-purple-50/80', iconWrap: 'bg-purple-700 text-white', num: 'text-purple-800' },
  logistics: { stripe: '#c2410c', wash: 'bg-orange-50/80', iconWrap: 'bg-orange-600 text-white', num: 'text-orange-800' },
  bureaucracy: { stripe: '#0f766e', wash: 'bg-teal-50/80', iconWrap: 'bg-teal-700 text-white', num: 'text-teal-800' },
  vip: { stripe: '#a16207', wash: 'bg-yellow-50/90', iconWrap: 'bg-yellow-700 text-white', num: 'text-yellow-900' },
};

export function useServiceFilters() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredZones = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SERVICE_ZONES.filter((zone) => {
      const matchesFilter = filter === 'all' || zone.filterTags.includes(filter);
      if (!matchesFilter) return false;
      if (!q) return true;
      const hay = `${zone.cardTitle} ${zone.cardDesc} ${zone.keywords}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search, filter]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilter('all');
  }, []);

  return { search, setSearch, filter, setFilter, filteredZones, resetFilters, filters: SERVICE_FILTERS };
}

export function useCopyToast() {
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => {
    setVisible(true);
    window.setTimeout(() => setVisible(false), 2800);
  }, []);
  return { visible, show };
}

export function CopyToast({ visible }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`services-toast ${visible ? 'services-toast--show' : ''}`}
    >
      <span className="material-symbols-outlined text-base">check_circle</span>
      הנוהל הועתק בהצלחה
    </div>
  );
}

export function ServiceTag({ tag }) {
  if (!tag) return null;
  const isNeed = tag.type === 'need';
  return (
    <span className={`services-tag ${isNeed ? 'services-tag--need' : 'services-tag--solution'}`}>
      <span className="material-symbols-outlined text-sm">{tag.icon}</span>
      {tag.label}
    </span>
  );
}

export function CopyProcedureButton({ text, onCopied, variant = 'default' }) {
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      onCopied?.();
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onCopied?.();
    }
  };

  return (
    <button type="button" onClick={handleCopy} className={`services-copy-btn ${variant === 'accent' ? 'services-copy-btn--accent' : ''}`}>
      <span className="material-symbols-outlined text-sm">content_copy</span>
      העתק נוהל לפניה
    </button>
  );
}

export function ServiceSearchBar({ search, onSearchChange, compact = false }) {
  return (
    <div className={`services-search ${compact ? 'services-search--compact' : ''}`}>
      <span className="material-symbols-outlined services-search__icon">search</span>
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="חפש משימה… דרכון, קצבה, תרופות, מונית…"
        className="services-search__input"
        dir="rtl"
      />
    </div>
  );
}

export function ServiceFilterRail({ filter, onFilterChange, filters }) {
  return (
    <div className="services-filter-rail" role="tablist" aria-label="סינון זירות">
      {filters.map((chip) => (
        <button
          key={chip.id}
          type="button"
          role="tab"
          aria-selected={filter === chip.id}
          onClick={() => onFilterChange(chip.id)}
          className={`services-filter-chip ${filter === chip.id ? 'services-filter-chip--active' : ''}`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export function ServiceAccordion({ section, defaultOpen = false, onCopied, tone }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article
      className={`services-accordion ${open ? 'services-accordion--open' : ''}`}
      style={{ '--zone-stripe': tone?.stripe }}
    >
      <button
        type="button"
        className="services-accordion__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="services-accordion__title">
          <span className="services-accordion__icon material-symbols-outlined">{section.icon}</span>
          {section.title}
        </span>
        <span className="material-symbols-outlined services-accordion__chevron">expand_more</span>
      </button>

      {open ? (
        <div className="services-accordion__body">
          {section.tag ? <ServiceTag tag={section.tag} /> : null}
          {section.body ? <p className="services-accordion__text">{section.body}</p> : null}
          {section.actions?.length ? (
            <ul className="services-action-list">
              {section.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          ) : null}
          {section.note ? <p className="services-accordion__note">{section.note}</p> : null}
          {section.copyText ? <CopyProcedureButton text={section.copyText} onCopied={onCopied} variant="accent" /> : null}
        </div>
      ) : null}
    </article>
  );
}

export function getZoneTone(zoneId) {
  return ZONE_TONES[zoneId] ?? ZONE_TONES.auth;
}

export function getZoneNumber(cardTitle) {
  const m = cardTitle.match(/^(\d+)/);
  return m ? m[1] : '•';
}
