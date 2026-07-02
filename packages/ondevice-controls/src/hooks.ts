import type { Args, StoryContext } from 'storybook/internal/csf';
import { useState, useEffect, useCallback } from 'react';
import {
  UPDATE_STORY_ARGS,
  RESET_STORY_ARGS,
  STORY_ARGS_UPDATED,
} from 'storybook/internal/core-events';

const getControlArgs = (story: StoryContext): Args =>
  (story as StoryContext & { unmappedArgs?: Args }).unmappedArgs ?? story.args;

export const useArgs = (
  storyId: string,
  storyStore: any
): [Args, (args: Args) => void, (argNames?: string[]) => void] => {
  const story: StoryContext = storyStore.fromId(storyId);
  if (!story) {
    throw new Error(`Unknown story: ${storyId}`);
  }

  const [args, setArgs] = useState(() => getControlArgs(story));
  useEffect(() => {
    const currentStory: StoryContext | undefined = storyStore.fromId(storyId);
    if (!currentStory) {
      return;
    }
    // Sync the args up with the initial args of the story, since the story ID
    // must have changed for this effect to run.
    setArgs(getControlArgs(currentStory));
    const cb = (changed: { storyId: string; args: Args }) => {
      if (changed.storyId === storyId) {
        const updatedStory: StoryContext | undefined = storyStore.fromId(storyId);
        setArgs(updatedStory ? getControlArgs(updatedStory) : changed.args);
      }
    };
    storyStore._channel.on(STORY_ARGS_UPDATED, cb);
    return () => storyStore._channel.off(STORY_ARGS_UPDATED, cb);
    // Exclude `story` from the dependencies, as these are not relevant
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
