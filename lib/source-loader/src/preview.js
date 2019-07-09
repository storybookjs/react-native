import addons from '@storybook/addons';
import { STORY_EVENT_ID } from './events';

const getLocation = (context, locationsMap) => locationsMap[context.id];

function sendEvent(
  context,
  source,
  locationsMap,
  mainFileLocation,
  dependencies,
  localDependencies,
  prefix,
  idsToFrameworks
) {
  const channel = addons.getChannel();
  const currentLocation = getLocation(context, locationsMap);

  channel.emit(STORY_EVENT_ID, {
    edition: {
      source,
      mainFileLocation,
      dependencies,
      localDependencies,
      prefix,
      idsToFrameworks,
    },
    story: {
      kind: context.kind,
      story: context.story,
    },
    location: {
      currentLocation,
      locationsMap,
    },
  });
}

export function addSource(storyFn, sourceContext) {
  const {
    __STORY__: source,
    __ADDS_MAP__: locationsMap = {},
    __MAIN_FILE_LOCATION__: mainFileLocation = '/index.js',
    __MODULE_DEPENDENCIES__: dependencies = [],
    __LOCAL_DEPENDENCIES__: localDependencies = {},
    __SOURCE_PREFIX__: prefix,
    __IDS_TO_FRAMEWORKS__: idsToFrameworks,
  } = sourceContext;
  const decorated = (context = {}) => {
    sendEvent(
      context,
      source,
      locationsMap,
      mainFileLocation,
      dependencies,
      localDependencies,
      prefix,
      idsToFrameworks
    );
    if (typeof storyFn === 'function') {
      return storyFn(context);
    }
    return storyFn;
  };
  decorated.story = (storyFn || {}).story;
  return decorated;
}

export function withSource(
  source,
  locationsMap = {},
  mainFileLocation = '/index.js',
  dependencies = [],
  localDependencies = {},
  prefix,
  idsToFrameworks
) {
  return (storyFn, context) => {
    sendEvent(
      context,
      source,
      locationsMap,
      mainFileLocation,
      dependencies,
      localDependencies,
      prefix,
      idsToFrameworks
    );
    return storyFn(context);
  };
}
