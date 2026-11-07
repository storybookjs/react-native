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

  // Keyed by story: when the story changes, its args are read during that render. Reading them in
  // an effect left the first render with the previous story's args, so controls that keep local
  // state (like the number input) started out empty.
  const [state, setState] = useState(() => ({ storyId, args: getStoryControlArgs() }));
  let args = state.args;
  if (state.storyId !== storyId) {
    args = getStoryControlArgs();
    setState({ storyId, args });
  }

  useEffect(() => {
    const cb = (changed: { storyId: string; args: Args }) => {
      if (changed.storyId === storyId) {
        // The STORY_ARGS_UPDATED payload comes straight from the ArgsStore,
        // which holds unmapped args — no need to re-read the story here.
        setState({ storyId, args: changed.args });
      }
    };
    storyStore._channel.on(STORY_ARGS_UPDATED, cb);
    return () => storyStore._channel.off(STORY_ARGS_UPDATED, cb);
  }, [storyId, storyStore]);

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
