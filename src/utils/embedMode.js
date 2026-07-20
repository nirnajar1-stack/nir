import { isValidPageId } from '../navigation.js';

/** @returns {boolean} */
export function isEmbedRequest() {
  const params = new URLSearchParams(window.location.search);
  return params.get('embed') === '1' || params.get('powerbi') === '1';
}

/** @returns {string | null} */
export function getEmbedPageFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  return page && isValidPageId(page) ? page : null;
}

/**
 * @param {string} pageId
 * @param {string} [origin] defaults to window.location.origin
 */
export function buildEmbedUrl(pageId, origin = typeof window !== 'undefined' ? window.location.origin : '') {
  const base = origin.replace(/\/$/, '');
  return `${base}/?embed=1&page=${encodeURIComponent(pageId)}#/${pageId}`;
}
