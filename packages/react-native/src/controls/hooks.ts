import type { Args, StoryContext } from 'storybook/internal/csf';
import { useState, useEffect, useCallback } from 'react';
import {
  UPDATE_STORY_ARGS,
  RESET_STORY_ARGS,
  STORY_ARGS_UPDATED,
} from 'storybook/internal/core-events';

// `prepareContext` adds `unmappedArgs` (the raw option keys, before mapping and
// conditional filtering) to every prepared story context at runtime, but core's
// StoryContext type doesn't declare it.
type PreparedStoryContext = StoryContext & { unmappedArgs?: Args };

// Controls must work with the unmapped values, same as web: `story.args` holds
// the mapped values, so a mapped `select` can't match them back to its options.
const getControlArgs = (story: PreparedStoryContext): Args => story.unmappedArgs ?? story.args;

export const useArgs = (
  storyId: string,
  storyStore: any
): [Args, (args: Args) => void, (argNames?: string[]) => void] => {
  // Reading a story runs `prepareContext` (arg mapping, conditional filtering),
  // so only do it when the args state needs (re)initializing, not every render.
  const getStoryControlArgs = useCallback(() => {
    const story: PreparedStoryContext | undefined = storyStore.fromId(storyId);
    if (!story) {
      throw new Error(`Unknown story: ${storyId}`);
    }
    return getControlArgs(story);
  }, [storyId, storyStore]);

  const [args, setArgs] = useState(getStoryControlArgs);
  useEffect(() => {
    // Sync the args up with the initial args of the story, since the story ID
    // must have changed for this effect to run.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArgs(getStoryControlArgs());
    const cb = (changed: { storyId: string; args: Args }) => {
      if (changed.storyId === storyId) {
        // The STORY_ARGS_UPDATED payload comes straight from the ArgsStore,
        // which holds unmapped args — no need to re-read the story here.
        setArgs(changed.args);
      }
    };
    storyStore._channel.on(STORY_ARGS_UPDATED, cb);
    return () => storyStore._channel.off(STORY_ARGS_UPDATED, cb);
    // Exclude `getStoryControlArgs` from the dependencies; it only varies with
    // `storyId`.
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
