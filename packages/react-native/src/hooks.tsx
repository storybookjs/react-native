import type { StoryContext } from '@storybook/csf';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import type { ReactRenderer } from '@storybook/react';

const storyContextAtom = atom(null as StoryContext<ReactRenderer> | null);

/**
 * Hook that returns a function to set the current story context.
 */
export function useSetStoryContext() {
  return useSetAtom(storyContextAtom);
}

/**
 * Hook to read the current story context.
 */
export function useStoryContext() {
  return useAtomValue(storyContextAtom);
}
