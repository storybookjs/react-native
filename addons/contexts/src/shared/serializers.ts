import { SelectionState } from './types.d';

/**
 * Deserialize URL query param into the specified selection state.
 */
type deserialize = (param?: string) => SelectionState | null;

export const deserialize: deserialize = param =>
  !param
    ? null
    : param
        .split(/,+/g)
        .map(str => str.split(/=+/g))
        .reduce<SelectionState | null>(
          (acc, [nodeId, name]) => (nodeId && name ? { ...acc, [nodeId]: name } : acc),
          null
        );

/**
 * Serialize the selection state in its string representation.
 */
type serialize = (state: ReturnType<deserialize>) => string | null;

export const serialize: serialize = state =>
  !state
    ? null
    : Object.entries(state)
        .map(tuple => tuple.join('='))
        .join(',');
