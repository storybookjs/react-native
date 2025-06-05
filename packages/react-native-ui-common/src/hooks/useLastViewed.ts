import { useCallback, useEffect, useRef } from 'react';

import type { Selection, StoryRef } from '../types';

export const useLastViewed = (selection: Selection) => {
  const lastViewedRef = useRef([]);

  const updateLastViewed = useCallback(
    (story: StoryRef) => {
      const items = lastViewedRef.current;
      const index = items.findIndex(
        ({ storyId, refId }) => storyId === story.storyId && refId === story.refId
      );
      if (index === 0) return;
      if (index === -1) {
        lastViewedRef.current = [story, ...items];
      } else {
        lastViewedRef.current = [story, ...items.slice(0, index), ...items.slice(index + 1)];
      }
    },
    [lastViewedRef]
  );

  useEffect(() => {
    if (selection) updateLastViewed(selection);
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  return {
    getLastViewed: useCallback(() => lastViewedRef.current, [lastViewedRef]),
    clearLastViewed: useCallback(() => {
      lastViewedRef.current = lastViewedRef.current.slice(0, 1);
    }, [lastViewedRef]),
  };
};
