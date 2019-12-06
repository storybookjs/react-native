import { ADDON_STATE_CHANGED, ADDON_STATE_SET } from '@storybook/core-events';

import {
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
} from '@storybook/addons';

export {
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
};

// We keep this store, because when stories are edited by the user, and HMR, state is lost.
// This allows us to restore instantly.
const addonStateCache: Record<string, any> = {};

export function useAddonState<S>(addonId: string, defaultState?: S): [S, (s: S) => void] {
  const [state, setState] = useState<S>(
    addonStateCache[addonId] ? addonStateCache[addonId] : defaultState
  );
  // only initialize after the first loading
  if (addonStateCache[addonId]) {
    addonStateCache[addonId] = state;
  }
  const allListeners = useMemo(
    () => ({
      [`${ADDON_STATE_CHANGED}-manager-${addonId}`]: (s: S) => setState(s),
      [`${ADDON_STATE_SET}-manager-${addonId}`]: (s: S) => setState(s),
    }),
    [addonId]
  );

  const emit = useChannel(allListeners, [addonId]);

  useEffect(() => {
    // init
    if (defaultState !== undefined && !addonStateCache[addonId]) {
      addonStateCache[addonId] = defaultState;
      emit(`${ADDON_STATE_SET}-client-${addonId}`, defaultState);
    }
  }, []);

  return [
    state,
    s => {
      setState(s);
      emit(`${ADDON_STATE_CHANGED}-client-${addonId}`, s);
    },
  ];
}
