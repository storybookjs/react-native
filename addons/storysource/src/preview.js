import addons from '@storybook/addons';
import { EVENT_ID } from './';

function getLocation(context, locationsMap) {
  return locationsMap[`${context.kind}@${context.story}`] || locationsMap[`@${context.story}`];
}

function setStorySource(context, source, locationsMap) {
  const channel = addons.getChannel();
  const location = getLocation(context, locationsMap);

  channel.emit(EVENT_ID, {
    source,
    location,
  });
}

export function withStorySource(source, locationsMap = {}) {
  return (story, context) => {
    setStorySource(context, source, locationsMap);
    return story();
  };
}
