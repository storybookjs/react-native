enum events {
  CHANNEL_CREATED = 'channelCreated',
  GET_CURRENT_STORY = 'getCurrentStory',
  SET_CURRENT_STORY = 'setCurrentStory',
  GET_STORIES = 'getStories',
  SET_STORIES = 'setStories',
  SELECT_STORY = 'selectStory',
  APPLY_SHORTCUT = 'applyShortcut',
  STORY_ADDED = 'storyAdded',
  FORCE_RE_RENDER = 'forceReRender',
  REGISTER_SUBSCRIPTION = 'registerSubscription',
  STORY_RENDERED = 'storyRendered',
  STORY_ERRORED = 'storyErrored',
  STORY_THREW_EXCEPTION = 'storyThrewException',
}

// Enables `import Events from ...`
export default events;

// Enables:
// import * as Events from ...
// import { CHANNEL_CREATED } as Events from ...
export const CHANNEL_CREATED = events.CHANNEL_CREATED;
export const GET_CURRENT_STORY = events.GET_CURRENT_STORY;
export const SET_CURRENT_STORY = events.SET_CURRENT_STORY;
export const GET_STORIES = events.GET_STORIES;
export const SET_STORIES = events.SET_STORIES;
export const SELECT_STORY = events.SELECT_STORY;
export const APPLY_SHORTCUT = events.APPLY_SHORTCUT;
export const STORY_ADDED = events.STORY_ADDED;
export const FORCE_RE_RENDER = events.FORCE_RE_RENDER;
export const REGISTER_SUBSCRIPTION = events.REGISTER_SUBSCRIPTION;
export const STORY_RENDERED = events.STORY_RENDERED;
export const STORY_ERRORED = events.STORY_ERRORED;
export const STORY_THREW_EXCEPTION = events.STORY_THREW_EXCEPTION;
