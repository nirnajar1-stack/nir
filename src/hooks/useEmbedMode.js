import { useMemo } from 'react';
import { getEmbedPageFromQuery, isEmbedRequest } from '../utils/embedMode.js';

export function useEmbedMode() {
  return useMemo(
    () => ({
      isEmbed: isEmbedRequest(),
      pageFromQuery: getEmbedPageFromQuery(),
    }),
    [],
  );
}
