import { SHARED_STATE_CHANGED, SHARED_STATE_SET } from '@storybook/core-events';

import {
  addons,
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

export function useSharedState<S>(sharedId: string, defaultState?: S): [S, (s: S) => void] {
  const channel = addons.getChannel();

  const [lastValue] =
    channel.last(`${SHARED_STATE_CHANGED}-manager-${sharedId}`) ||
    channel.last(`${SHARED_STATE_SET}-manager-${sharedId}`) ||
    [];

  const [state, setState] = useState<S>(lastValue || defaultState);

  const allListeners = useMemo(
    () => ({
      [`${SHARED_STATE_CHANGED}-manager-${sharedId}`]: (s: S) => setState(s),
      [`${SHARED_STATE_SET}-manager-${sharedId}`]: (s: S) => setState(s),
    }),
    [sharedId]
  );

  const emit = useChannel(allListeners, [sharedId]);

  useEffect(() => {
    // init
    if (defaultState !== undefined && !lastValue) {
      emit(`${SHARED_STATE_SET}-client-${sharedId}`, defaultState);
    }
  }, [sharedId]);

  return [
    state,
    s => {
      setState(s);
      emit(`${SHARED_STATE_CHANGED}-client-${sharedId}`, s);
    },
  ];
}

export function useAddonState<S>(addonId: string, defaultState?: S): [S, (s: S) => void] {
  return useSharedState<S>(addonId, defaultState);
}

export function useStoryState<S>(defaultState?: S): [S, (s: S) => void] {
  const { id: storyId } = useStoryContext();
  return useSharedState<S>(`story-state-${storyId}`, defaultState);
}
