export interface CoreEvents {
  CHANNEL_CREATED: string;
  GET_CURRENT_STORY: string;
  SET_CURRENT_STORY: string;
  GET_STORIES: string;
  SET_STORIES: string;
  SELECT_STORY: string;
  APPLY_SHORTCUT: string;
  STORY_ADDED: string;
  FORCE_RE_RENDER: string;
  REGISTER_SUBSCRIPTION: string;
  STORY_RENDERED: string;
  STORY_ERRORED: string;
  STORY_THREW_EXCEPTION: string;
}

const events: CoreEvents = {
  CHANNEL_CREATED: 'channelCreated',
  GET_CURRENT_STORY: 'getCurrentStory',
  SET_CURRENT_STORY: 'setCurrentStory',
  GET_STORIES: 'getStories',
  SET_STORIES: 'setStories',
  SELECT_STORY: 'selectStory',
  APPLY_SHORTCUT: 'applyShortcut',
  STORY_ADDED: 'storyAdded',
  FORCE_RE_RENDER: 'forceReRender',
  REGISTER_SUBSCRIPTION: 'registerSubscription',
  STORY_RENDERED: 'storyRendered',
  STORY_ERRORED: 'storyErrored',
  STORY_THREW_EXCEPTION: 'storyThrewException',
};

export default events;
