import type { Args, StoryContext } from 'storybook/internal/csf';
import { useState, useEffect, useCallback } from 'react';
import {
  UPDATE_STORY_ARGS,
  RESET_STORY_ARGS,
  STORY_ARGS_UPDATED,
} from 'storybook/internal/core-events';

export const useArgs = (
  storyId: string,
  storyStore: any
): [Args, (args: Args) => void, (argNames?: string[]) => void] => {
  const story: StoryContext = storyStore.fromId(storyId);
  if (!story) {
    throw new Error(`Unknown story: ${storyId}`);
  }

  const { args: initialArgs } = story;
  const [args, setArgs] = useState(initialArgs);
  useEffect(() => {
    // Sync the args up with the initial args of the story, since the story ID
    // must have changed for this effect to run.
    setArgs(initialArgs);
    const cb = (changed: { storyId: string; args: Args }) => {
      if (changed.storyId === storyId) {
        setArgs(changed.args);
      }
    };
    storyStore._channel.on(STORY_ARGS_UPDATED, cb);
    return () => storyStore._channel.off(STORY_ARGS_UPDATED, cb);
    // Exclude `initialArgs` from the dependencies, as these are not relevant
    // until `storyId` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const updateArgs = useCallback(
    (newArgs) => {
      storyStore._channel.emit(UPDATE_STORY_ARGS, { storyId, updatedArgs: newArgs });
    },
    [storyId, storyStore]
  );
  const resetArgs = useCallback(
    (argNames?: string[]) => {
      storyStore._channel.emit(RESET_STORY_ARGS, { storyId, argNames });
    },
    [storyId, storyStore]
  );
  return [args, updateArgs, resetArgs];
};
