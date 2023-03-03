import React, { useMemo } from 'react';
import type { StoryContext } from '@storybook/csf';
import { atom, useAtom, useAtomValue, useSetAtom, getDefaultStore } from 'jotai';
import { useTheme as useEmotionTheme } from 'emotion-theming';
import type { Theme } from './preview/components/Shared/theme';

import type { ReactNativeFramework } from './types/types-6.0';

const storyContextAtom = atom(null as StoryContext<ReactNativeFramework> | null);

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
  const paramAtom = useMemo(() => atom((get) => get(storyContextAtom)?.parameters?.[name]), [name]);
  return useAtomValue(paramAtom) ?? defaultValue;
}

/**
 * Hook that indicates if `storyId` is the currently selected story.
 */
export function useIsStorySelected(storyId: string) {
  return useAtomValue(
    useMemo(() => atom((get) => get(storyContextAtom)?.id === storyId), [storyId])
  );
}

/**
 * Hook that indicates if `title` is the currently selected story section.
 */
export function useIsStorySectionSelected(title: string) {
  return useAtomValue(
    useMemo(() => atom((get) => get(storyContextAtom)?.title === title), [title])
  );
}

/**
 * Hook that causes a re-render when the currently selected story is changed.
 */
export function useUpdateOnStoryChanged() {
  useAtomValue(useMemo(() => atom((get) => get(storyContextAtom)?.id), []));
}

/**
 * Hook that gets the current theme values.
 */
export function useTheme() {
  return useEmotionTheme<Theme>();
}

/**
 * A boolean atom creator for an atom that can only be toggled between
 * true/false.
 *
 * @see {@link https://jotai.org/docs/recipes/atom-creators#atomwithtoggle}
 */
export function atomWithToggle(initialValue?: boolean) {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom);
    set(anAtom, update);
  });
  return anAtom;
}

const isUIVisibleAtom = atomWithToggle(true);

/**
 * Hook that retrieves the current state, and a setter, for the `isUIVisible`
 * atom.
 */
export function useIsUIVisible() {
  return useAtom(isUIVisibleAtom);
}

const isSplitPanelVisibleAtom = atomWithToggle(false);

/**
 * Hook that retrieves the current state, and a setter, for the
 * `isSplitPanelVisibleAtom` atom.
 */
export function useIsSplitPanelVisible() {
  return useAtom(isSplitPanelVisibleAtom);
}

interface SyncExternalUIParams {
  isUIVisible?: boolean;
  isSplitPanelVisible?: boolean;
}

/**
 * Sync the UI atom states with external values, such as from Story parameters.
 */
export function syncExternalUI({ isUIVisible, isSplitPanelVisible }: SyncExternalUIParams) {
  const jotaiStore = getDefaultStore();
  if (isUIVisible !== undefined) {
    jotaiStore.set(isUIVisibleAtom, isUIVisible);
  }
  if (isSplitPanelVisible !== undefined) {
    jotaiStore.set(isSplitPanelVisibleAtom, isSplitPanelVisible);
  }
}

const selectedAddonAtom = atom(undefined as string);

/**
 * Hook that manages the state for the currently selected addon.
 *
 * This value persists across stories, so that the same addon will be selected
 * when switching stories.
 */
export function useSelectedAddon(initialValue?: string) {
  const result = useAtom(selectedAddonAtom);
  const set = result[1];
  React.useEffect(() => {
    const jotaiStore = getDefaultStore();
    // Only apply the initial value once, and only if the atom doesn't have a
    // value yet.
    if (jotaiStore.get(selectedAddonAtom) === undefined) {
      set(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return result;
}
