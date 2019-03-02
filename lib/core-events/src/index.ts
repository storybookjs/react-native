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
export const CHANNEL_CREATED = events.CHANNEL_CREATED;
export const GET_CURRENT_STORY = events.GET_CURRENT_STORY;
export const SET_CURRENT_STORY = events.SET_CURRENT_STORY;
export const GET_STORIES = events.GET_STORIES;
export const SET_STORIES = events.SET_STORIES;
export const STORIES_CONFIGURED = events.STORIES_CONFIGURED;
export const SELECT_STORY = events.SELECT_STORY;
export const PREVIEW_KEYDOWN = events.PREVIEW_KEYDOWN;
export const FORCE_RE_RENDER = events.FORCE_RE_RENDER;
export const REGISTER_SUBSCRIPTION = events.REGISTER_SUBSCRIPTION;
export const STORY_INIT = events.STORY_INIT;
export const STORY_ADDED = events.STORY_ADDED;
export const STORY_RENDER = events.STORY_RENDER;
export const STORY_RENDERED = events.STORY_RENDERED;
export const STORY_MISSING = events.STORY_MISSING;
export const STORY_ERRORED = events.STORY_ERRORED;
export const STORY_CHANGED = events.STORY_CHANGED;
export const STORY_THREW_EXCEPTION = events.STORY_THREW_EXCEPTION;
