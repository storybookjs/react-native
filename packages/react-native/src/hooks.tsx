import type { Args, StoryContext } from 'storybook/internal/csf';
import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import type { ReactRenderer } from '@storybook/react';

const store = createStore();

const storyContextAtom = atom(null as StoryContext<ReactRenderer, Args> | null);

/**
 * Hook that returns a function to set the current story context.
 */
export function useSetStoryContext() {
  return useSetAtom(storyContextAtom, { store });
}

/**
 * Hook to read the current story context.
 */
export function useStoryContext() {
  return useAtomValue(storyContextAtom, { store });
}
