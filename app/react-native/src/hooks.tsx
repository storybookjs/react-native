import { useMemo } from 'react';
import type { StoryContext } from '@storybook/csf';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import type { ReactNativeFramework } from './types/types-6.0';

const storyContextAtom = atom(null as (StoryContext<ReactNativeFramework> | null));

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

/**
 * Hook that reads the value of a specific story context parameter.
 */
export function useStoryContextParam<T = any>(name: string, defaultValue?: T): T {
  const paramAtom = useMemo(() => atom(get => get(storyContextAtom)?.parameters?.[name]), [name]);
  return useAtomValue(paramAtom) ?? defaultValue;
}

/**
 * Hook that indicates if `storyId` is the currently selected story.
 */
export function useIsStorySelected(storyId: string) {
  return useAtomValue(useMemo(() => atom(get => get(storyContextAtom)?.id === storyId), [storyId]));
}

/**
 * Hook that indicates if `title` is the currently selected story section.
 */
export function useIsStorySectionSelected(title: string) {
  return useAtomValue(useMemo(() => atom(get => get(storyContextAtom)?.title === title), [title]));
}
