import type { StoriesHash } from 'storybook/manager-api';
import type { Dispatch } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import { getAncestorIds } from '../util/tree';

export type ExpandedState = Record<string, boolean>;

export interface ExpandAction {
  ids: string[];
  value: boolean;
}

export interface ExpandedProps {
  refId: string;
  data: StoriesHash;
  initialExpanded?: ExpandedState;
  rootIds: string[];
  selectedStoryId: string | null;
  onSelectStoryId: (storyId: string) => void;
}

const initializeExpanded = ({
  initialExpanded,
  rootIds,
}: {
  refId: string;
  data: StoriesHash;
  initialExpanded?: ExpandedState;
  rootIds: string[];
}) => {
  const highlightedAncestors = [];
  return [...rootIds, ...highlightedAncestors].reduce<ExpandedState>(
    (acc, id) => Object.assign(acc, { [id]: id in initialExpanded ? initialExpanded[id] : true }),
    {}
  );
};

export const useExpanded = ({
  refId,
  data,
  initialExpanded,
  rootIds,
  selectedStoryId,
}: ExpandedProps): [ExpandedState, Dispatch<ExpandAction>] => {
  // Track the set of currently expanded nodes within this tree.
  // Root nodes are expanded by default.
  const [expanded, setExpanded] = useReducer(
    (state: ExpandedState, { ids, value }: ExpandAction) =>
      ids.reduce((acc, id) => Object.assign(acc, { [id]: value }), { ...state }),
    { refId, data, rootIds, initialExpanded },
    initializeExpanded
  );

  const updateExpanded = useCallback(({ ids, value }: ExpandAction) => {
    setExpanded({ ids, value });
  }, []);

  // Expand the whole ancestry of the currently selected story whenever it changes.
  useEffect(() => {
    setExpanded({ ids: getAncestorIds(data, selectedStoryId), value: true });
  }, [data, selectedStoryId]);

  return [expanded, updateExpanded];
};
