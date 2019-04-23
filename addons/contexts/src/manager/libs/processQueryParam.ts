import { SelectionState } from '../../types';

/**
 *
 */
type serialize = (state: SelectionState) => string | null;

export const serialize: serialize = state => null;

/**
 *
 */
type deserialize = (param: string) => SelectionState | undefined;

export const deserialize: deserialize = param => undefined;
