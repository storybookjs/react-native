import type { StoriesHash } from '@storybook/manager-api';
import { useStorybookApi } from '@storybook/manager-api';
import { STORIES_COLLAPSE_ALL, STORIES_EXPAND_ALL } from '@storybook/core-events';

import type { Dispatch, MutableRefObject, Reducer } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import type { Highlight } from './types';

import { /* isAncestor */ getAncestorIds /* getDescendantIds */ } from './util/tree';

export type ExpandedState = Record<string, boolean>;

export interface ExpandAction {
  ids: string[];
  value: boolean;
}

export interface ExpandedProps {
  //   containerRef: MutableRefObject<HTMLElement>;
  //   isBrowsing: boolean;
  refId: string;
  data: StoriesHash;
  initialExpanded?: ExpandedState;
  rootIds: string[];
  //   highlightedRef: MutableRefObject<Highlight>;
  //   setHighlightedItemId: (storyId: string) => void;
  selectedStoryId: string | null;
  //   onSelectStoryId: (storyId: string) => void;
}

const initializeExpanded = ({
  //   refId,
  //   data,
  initialExpanded,
  //   highlightedRef,
  rootIds,
}: {
  refId: string;
  data: StoriesHash;
  initialExpanded?: ExpandedState;
  //   highlightedRef: MutableRefObject<Highlight>;
  rootIds: string[];
}) => {
  const highlightedAncestors = [];
  return [...rootIds, ...highlightedAncestors].reduce<ExpandedState>(
    (acc, id) => Object.assign(acc, { [id]: id in initialExpanded ? initialExpanded[id] : true }),
    {}
  );
};

const noop = () => {};

export const useExpanded = ({
  //   containerRef,
  //   isBrowsing,
  refId,
  data,
  initialExpanded,
  rootIds,
  //   highlightedRef,
  //   setHighlightedItemId,
  //   onSelectStoryId,
  selectedStoryId,
}: ExpandedProps): [ExpandedState, Dispatch<ExpandAction>] => {
  const api = useStorybookApi();

  // Track the set of currently expanded nodes within this tree.
  // Root nodes are expanded by default.
  const [expanded, setExpanded] = useReducer<
    Reducer<ExpandedState, ExpandAction>,
    {
      refId: string;
      data: StoriesHash;
      //   highlightedRef: MutableRefObject<Highlight>;
      rootIds: string[];
      initialExpanded: ExpandedState;
    }
  >(
    (state, { ids, value }) =>
      ids.reduce((acc, id) => Object.assign(acc, { [id]: value }), { ...state }),
    { refId, data, /* highlightedRef */ rootIds, initialExpanded },
    initializeExpanded
  );

  //   const highlightElement = useCallback(
  //     (element: Element) => {
  //       setHighlightedItemId(element.getAttribute('data-item-id'));
  //     //   scrollIntoView(element);
  //     },
  //     [setHighlightedItemId]
  //   );

  const updateExpanded = useCallback(({ ids, value }: ExpandAction) => {
    setExpanded({ ids, value });
    //   if (ids.length === 1) {
    //     const element = containerRef.current?.querySelector(
    //       `[data-item-id="${ids[0]}"][data-ref-id="${refId}"]`
    //     );
    //     if (element) highlightElement(element);
    //   }
  }, []);

  // Expand the whole ancestry of the currently selected story whenever it changes.
  useEffect(() => {
    setExpanded({ ids: getAncestorIds(data, selectedStoryId), value: true });
  }, [data, selectedStoryId]);

  const collapseAll = useCallback(() => {
    const ids = Object.keys(data).filter((id) => !rootIds.includes(id));
    setExpanded({ ids, value: false });
  }, [data, rootIds]);

  const expandAll = useCallback(() => {
    setExpanded({ ids: Object.keys(data), value: true });
  }, [data]);

  useEffect(() => {
    if (!api) return noop;

    api.on(STORIES_COLLAPSE_ALL, collapseAll);
    api.on(STORIES_EXPAND_ALL, expandAll);

    return () => {
      api.off(STORIES_COLLAPSE_ALL, collapseAll);
      api.off(STORIES_EXPAND_ALL, expandAll);
    };
  }, [api, collapseAll, expandAll]);

  return [expanded, updateExpanded];
};
