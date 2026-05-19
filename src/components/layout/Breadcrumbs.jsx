import { getPageMeta } from '../../navigation.js';

export default function Breadcrumbs({ activePage }) {
  const { groupLabel, pageLabel } = getPageMeta(activePage);

  return (
    <nav aria-label="מיקום בדף" className="mb-3 flex items-center gap-2 text-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-base text-primary" aria-hidden>
        home
      </span>
      <span aria-hidden className="text-outline-variant">
        /
      </span>
      <span>{groupLabel}</span>
      <span aria-hidden className="text-outline-variant">
        /
      </span>
      <span className="font-semibold text-on-surface">{pageLabel}</span>
    </nav>
  );
}
