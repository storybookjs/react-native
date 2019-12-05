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

export function useAddonState<S>(addonId: string, defaultValue?: S): [S, (s: S) => void] {
  const [state, setState] = useState<S>(defaultValue);
  const emit = useChannel(
    {
      [`${ADDON_STATE_CHANGED}-${addonId}`]: (s: S) => {
        console.log(ADDON_STATE_CHANGED, s);
        setState(s);
      },
      [`${ADDON_STATE_SET}-${addonId}`]: (s: S) => {
        if (s !== undefined) {
          console.log(ADDON_STATE_SET, s);
          setState(s);
        }
      },
    },
    [addonId]
  );

  useEffect(() => {
    // init
    emit(`${ADDON_STATE_SET}-${addonId}`, defaultValue);
  }, []);

  return [
    state,
    s => {
      emit(`${ADDON_STATE_CHANGED}-${addonId}`, s);
    },
  ];
}
