enum events {
  CHANNEL_CREATED = 'channelCreated',
  GET_CURRENT_STORY = 'getCurrentStory',
  SET_CURRENT_STORY = 'setCurrentStory',
  GET_STORIES = 'getStories',
  SET_STORIES = 'setStories',
  STORIES_CONFIGURED = 'storiesConfigured',
  SELECT_STORY = 'selectStory',
  PREVIEW_KEYDOWN = 'previewKeydown',
  STORY_ADDED = 'storyAdded',
  STORY_CHANGED = 'storyChanged',
  STORY_UNCHANGED = 'storyUnchanged',
  FORCE_RE_RENDER = 'forceReRender',
  REGISTER_SUBSCRIPTION = 'registerSubscription',
  STORY_INIT = 'storyInit',
  STORY_RENDER = 'storyRender',
  STORY_RENDERED = 'storyRendered',
  STORY_MISSING = 'storyMissing',
  STORY_ERRORED = 'storyErrored',
  STORY_THREW_EXCEPTION = 'storyThrewException',
}

// Enables: `import Events from ...`
export default events;

// Enables: `import * as Events from ...` or `import { CHANNEL_CREATED } as Events from ...`
// This is the preferred method
export const { CHANNEL_CREATED } = events;
export const { GET_CURRENT_STORY } = events;
export const { SET_CURRENT_STORY } = events;
export const { GET_STORIES } = events;
export const { SET_STORIES } = events;
export const { STORIES_CONFIGURED } = events;
export const { SELECT_STORY } = events;
export const { PREVIEW_KEYDOWN } = events;
export const { FORCE_RE_RENDER } = events;
export const { REGISTER_SUBSCRIPTION } = events;
export const { STORY_INIT } = events;
export const { STORY_ADDED } = events;
export const { STORY_RENDER } = events;
export const { STORY_RENDERED } = events;
export const { STORY_MISSING } = events;
export const { STORY_ERRORED } = events;
export const { STORY_CHANGED } = events;
export const { STORY_THREW_EXCEPTION } = events;
