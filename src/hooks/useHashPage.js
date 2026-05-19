import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PAGE, isValidPageId } from '../navigation.js';

function readPageFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  return isValidPageId(raw) ? raw : DEFAULT_PAGE;
}

export function useHashPage() {
  const [activePage, setActivePageState] = useState(readPageFromHash);

  const setActivePage = useCallback((pageId) => {
    if (!isValidPageId(pageId)) return;
    window.location.hash = `/${pageId}`;
    setActivePageState(pageId);
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
