import { Args } from '@storybook/addons';
import { useState, useEffect, useCallback } from 'react';
import Events, { FORCE_RE_RENDER } from '@storybook/core-events';
import useDebouncedCallback from './useDebounceCallback';

export const useArgs = (
  storyId: string,
  storyStore: any
): [Args, (args: Args) => void, (argNames?: string[]) => void] => {
  // TODO: remove need to force re-render
  const debouncedReRender = useDebouncedCallback(
    () => storyStore._channel.emit(FORCE_RE_RENDER),
    100
  );

  useEffect(() => {
    return () => {
      debouncedReRender.cancel();
    };
  }, [debouncedReRender]);

  const story = storyStore.fromId(storyId);
  if (!story) {
    throw new Error(`Unknown story: ${storyId}`);
  }

  const { args: initialArgs } = story;
  const [args, setArgs] = useState(initialArgs);
  useEffect(() => {
    const cb = (changed: { storyId: string; args: Args }) => {
      if (changed.storyId === storyId) {
        setArgs(changed.args);
      }
    };
    storyStore._channel.on(Events.STORY_ARGS_UPDATED, cb);
    return () => storyStore._channel.off(Events.STORY_ARGS_UPDATED, cb);
  }, [storyId, storyStore._channel]);

  const updateArgs = useCallback(
    (newArgs) => {
      storyStore.updateStoryArgs(storyId, newArgs);

      //TODO: remove this if possible
      debouncedReRender();
    },
    [debouncedReRender, storyId, storyStore]
  );
  const resetArgs = useCallback(
    (argNames?: string[]) => {
      storyStore.resetStoryArgs(storyId, argNames);
      //TODO: remove this if possible
      storyStore._channel.emit(FORCE_RE_RENDER);
    },
    [storyId, storyStore]
  );
  return [args, updateArgs, resetArgs];
};
