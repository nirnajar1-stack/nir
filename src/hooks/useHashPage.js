import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PAGE, isValidPageId } from '../navigation.js';

function readPageFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (raw === 'analytics-methodology') return 'methodology-guide';
  if (raw === 'analytics-overview') return 'analytics-intensity';
  if (raw === 'services-hub') return 'services-cards';
  return isValidPageId(raw) ? raw : DEFAULT_PAGE;
}

export function useHashPage() {
  const [activePage, setActivePageState] = useState(readPageFromHash);

  const setActivePage = useCallback((pageId) => {
    let resolved = pageId;
    if (pageId === 'analytics-methodology') resolved = 'methodology-guide';
    if (pageId === 'analytics-overview') resolved = 'analytics-intensity';
    if (pageId === 'services-hub') resolved = 'services-cards';
    if (!isValidPageId(resolved)) return;
    window.location.hash = `/${resolved}`;
    setActivePageState(resolved);
  }, []);

  useEffect(() => {
    const onHashChange = () => setActivePageState(readPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.location.hash = `/${DEFAULT_PAGE}`;
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return [activePage, setActivePage];
}
