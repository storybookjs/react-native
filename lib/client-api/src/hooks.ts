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

export function useAddonState<S>(addonId: string, defaultState?: S): [S, (s: S) => void] {
  const [state, setState] = useState<S>(defaultState);
  const emit = useChannel(
    {
      [`${ADDON_STATE_CHANGED}-manager-${addonId}`]: (s: S) => {
        setState(s);
      },
      [`${ADDON_STATE_SET}-manager-${addonId}`]: (s: S) => {
        setState(s);
      },
    },
    [addonId]
  );

  useEffect(() => {
    // init
    if (defaultState !== undefined) {
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
