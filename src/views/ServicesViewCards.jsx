import { useState } from 'react';
import { SERVICE_ZONES } from '../data/servicesData.js';
import {
  CopyToast,
  getZoneNumber,
  getZoneTone,
  ServiceAccordion,
  ServiceFilterRail,
  ServiceSearchBar,
  useCopyToast,
  useServiceFilters,
} from '../components/services/serviceUi.jsx';

function ServicesHero({ resultCount }) {
  return (
    <header className="services-hero">
      <div className="services-hero__glow" aria-hidden />
      <div className="services-hero__content">
        <p className="services-hero__eyebrow">מערכת החלטות אופרטיבית</p>
        <h2 className="services-hero__title">
          מרכז <span className="services-hero__accent">החלטות</span>
        </h2>
        <p className="services-hero__desc">
          תצוגת כרטיסים — בחרו זירה, סננו לפי תחום, וקבלו נהלים מוכנים להעתקה לפניות.
        </p>
        <div className="services-hero__stats">
          <span className="services-stat-pill">
            <span className="material-symbols-outlined text-base">hub</span>
            8 זירות מענה
          </span>
          <span className="services-stat-pill">
            <span className="material-symbols-outlined text-base">filter_list</span>
            {resultCount} מוצגות כעת
          </span>
        </div>
      </div>
    </header>
  );
}

function ZoneCard({ zone, onSelect }) {
  const tone = getZoneTone(zone.id);
  const num = getZoneNumber(zone.cardTitle);

  return (
    <button
      type="button"
      onClick={() => onSelect(zone.id)}
      className="services-zone-card group"
      style={{ '--zone-stripe': tone.stripe }}
    >
      <span className="services-zone-card__stripe" aria-hidden />
      <span className={`services-zone-card__num ${tone.num}`}>{num}</span>
      <span className={`services-zone-card__icon-wrap ${tone.iconWrap}`}>
        <span className="material-symbols-outlined text-3xl">{zone.icon}</span>
      </span>
      <h3 className="services-zone-card__title">{zone.cardTitle.replace(/^\d+\.\s*/, '')}</h3>
      <p className="services-zone-card__desc">{zone.cardDesc}</p>
      <span className="services-zone-card__meta">
        <span className="material-symbols-outlined text-sm">layers</span>
        {zone.sections.length} נהלים
      </span>
      <span className="services-zone-card__cta">
        כניסה לזירה
        <span className="material-symbols-outlined text-sm">north_west</span>
      </span>
    </button>
  );
}

function ZoneDetailPanel({ zone, onBack, onCopied }) {
  const tone = getZoneTone(zone.id);
  const num = getZoneNumber(zone.cardTitle);

  return (
    <div className="services-detail">
      <div className="services-detail__hero" style={{ '--zone-stripe': tone.stripe }}>
        <button type="button" onClick={onBack} className="services-back-btn">
          <span className="material-symbols-outlined">arrow_forward</span>
          חזרה לרשת הכרטיסים
        </button>
        <div className="services-detail__hero-inner">
          <span className={`services-detail__badge ${tone.iconWrap}`}>
            <span className="material-symbols-outlined text-2xl">{zone.icon}</span>
          </span>
          <div>
            <p className="services-detail__eyebrow">זירה {num}</p>
            <h2 className="services-detail__title">{zone.zoneHighlight}</h2>
            {zone.intro ? <p className="services-detail__intro">{zone.intro}</p> : null}
          </div>
        </div>
      </div>

      <div className="services-detail__sections">
        {zone.sections.map((section, idx) => (
          <ServiceAccordion
            key={section.id}
            section={section}
            defaultOpen={idx === 0}
            onCopied={onCopied}
            tone={tone}
          />
        ))}
      </div>
    </div>
  );
}

export default function ServicesViewCards() {
  const { search, setSearch, filter, setFilter, filteredZones, resetFilters, filters } = useServiceFilters();
  const [activeZoneId, setActiveZoneId] = useState(null);
  const { visible: toastVisible, show: showToast } = useCopyToast();

  const activeZone = activeZoneId ? SERVICE_ZONES.find((z) => z.id === activeZoneId) : null;

  const handleBack = () => {
    setActiveZoneId(null);
    resetFilters();
  };

  if (activeZoneId && activeZone) {
    return (
      <div className="services-shell">
        <ZoneDetailPanel zone={activeZone} onBack={handleBack} onCopied={showToast} />
        <CopyToast visible={toastVisible} />
      </div>
    );
  }

  return (
    <div className="services-shell">
      <ServicesHero resultCount={filteredZones.length} />

      <div className="services-toolbar">
        <ServiceSearchBar search={search} onSearchChange={setSearch} />
        <ServiceFilterRail filter={filter} onFilterChange={setFilter} filters={filters} />
      </div>

      {filteredZones.length === 0 ? (
        <div className="services-empty">
          <span className="material-symbols-outlined text-4xl text-outline-variant">search_off</span>
          <p>לא נמצאו זירות תואמות — נסו מילת חיפוש אחרת או «הצג הכל».</p>
        </div>
      ) : (
        <div className="services-cards-grid">
          {filteredZones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} onSelect={setActiveZoneId} />
          ))}
        </div>
      )}

      <CopyToast visible={toastVisible} />
    </div>
  );
}
