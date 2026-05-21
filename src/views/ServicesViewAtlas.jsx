import { useEffect, useState } from 'react';
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

function ZoneNavItem({ zone, active, onSelect }) {
  const tone = getZoneTone(zone.id);
  const num = getZoneNumber(zone.cardTitle);

  return (
    <button
      type="button"
      onClick={() => onSelect(zone.id)}
      className={`services-atlas-nav__item ${active ? 'services-atlas-nav__item--active' : ''}`}
      style={{ '--zone-stripe': tone.stripe }}
      aria-current={active ? 'true' : undefined}
    >
      <span className={`services-atlas-nav__num ${tone.num}`}>{num}</span>
      <span className="services-atlas-nav__text">
        <span className="services-atlas-nav__label">{zone.cardTitle.replace(/^\d+\.\s*/, '')}</span>
        <span className="services-atlas-nav__sub">{zone.sections.length} נהלים</span>
      </span>
      <span className="material-symbols-outlined services-atlas-nav__icon">{zone.icon}</span>
    </button>
  );
}

export default function ServicesViewAtlas() {
  const { search, setSearch, filter, setFilter, filteredZones, filters } = useServiceFilters();
  const [activeZoneId, setActiveZoneId] = useState(SERVICE_ZONES[0]?.id ?? null);
  const { visible: toastVisible, show: showToast } = useCopyToast();

  useEffect(() => {
    if (!filteredZones.length) return;
    if (!filteredZones.some((z) => z.id === activeZoneId)) {
      setActiveZoneId(filteredZones[0].id);
    }
  }, [filteredZones, activeZoneId]);

  const activeZone = filteredZones.find((z) => z.id === activeZoneId) ?? filteredZones[0];
  const tone = activeZone ? getZoneTone(activeZone.id) : getZoneTone('auth');

  return (
    <div className="services-shell services-atlas">
      <header className="services-atlas-header">
        <div>
          <p className="services-hero__eyebrow">תצוגת מפת זירות</p>
          <h2 className="services-atlas-header__title">ספר הנחיות מענה</h2>
          <p className="services-atlas-header__desc">
            ניווט רציף — כל הזירות בפריסה אחת: בחרו זירה משמאל ועיינו בנהלים ללא מעבר בין מסכים.
          </p>
        </div>
        <span className="services-atlas-header__badge">
          <span className="material-symbols-outlined text-base">view_sidebar</span>
          Atlas
        </span>
      </header>

      <div className="services-toolbar services-toolbar--atlas">
        <ServiceSearchBar search={search} onSearchChange={setSearch} compact />
        <ServiceFilterRail filter={filter} onFilterChange={setFilter} filters={filters} />
      </div>

      {filteredZones.length === 0 ? (
        <div className="services-empty">
          <span className="material-symbols-outlined text-4xl text-outline-variant">search_off</span>
          <p>לא נמצאו זירות — נסו לשנות את הסינון.</p>
        </div>
      ) : (
        <div className="services-atlas-layout">
          <nav className="services-atlas-nav" aria-label="רשימת זירות">
            {filteredZones.map((zone) => (
              <ZoneNavItem
                key={zone.id}
                zone={zone}
                active={zone.id === activeZone?.id}
                onSelect={setActiveZoneId}
              />
            ))}
          </nav>

          {activeZone ? (
            <section
              className="services-atlas-panel"
              style={{ '--zone-stripe': tone.stripe }}
              aria-labelledby="atlas-zone-title"
            >
              <div className={`services-atlas-panel__head ${tone.wash}`}>
                <span className={`services-atlas-panel__icon ${tone.iconWrap}`}>
                  <span className="material-symbols-outlined text-3xl">{activeZone.icon}</span>
                </span>
                <div>
                  <p className="services-detail__eyebrow">זירה {getZoneNumber(activeZone.cardTitle)}</p>
                  <h3 id="atlas-zone-title" className="services-atlas-panel__title">
                    {activeZone.zoneHighlight}
                  </h3>
                  {activeZone.intro ? (
                    <p className="services-atlas-panel__intro">{activeZone.intro}</p>
                  ) : null}
                </div>
              </div>

              <div className="services-atlas-panel__body">
                {activeZone.sections.map((section, idx) => (
                  <ServiceAccordion
                    key={section.id}
                    section={section}
                    defaultOpen={idx === 0}
                    onCopied={showToast}
                    tone={tone}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}

      <CopyToast visible={toastVisible} />
    </div>
  );
}
