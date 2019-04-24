import { SelectionState } from './types';

/**
 * Serialize the selection state in its string representation.
 */
type serialize = (state: SelectionState) => string | null;

export const serialize: serialize = state =>
  !state
    ? null
    : Object.entries(state)
        .map(tuple => tuple.join('='))
        .join(',');

/**
 * Deserialize URL query param into the specified selection state.
 */
type deserialize = (param: string) => SelectionState | undefined;

export const deserialize: deserialize = param =>
  !param
    ? undefined
    : param
        .split(/,+/g)
        .map(str => str.split(/=+/g))
        .reduce((acc, [nodeId, name]) => (nodeId && name ? { ...acc, [nodeId]: name } : acc), {});
