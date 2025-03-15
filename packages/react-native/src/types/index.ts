import type { LoaderFunction } from 'storybook/internal/types';

export interface RequireContext {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
}

export type Loadable = RequireContext | RequireContext[] | LoaderFunction;
