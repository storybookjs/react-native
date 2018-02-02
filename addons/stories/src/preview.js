import addons from '@storybook/addons';
import { EVENT_ID } from './';

function setStorySource(source, map, context) {
  const channel = addons.getChannel();
  const location = map[`${context.kind}#${context.story}`];

  channel.emit(EVENT_ID, {
    source,
    location,
  });
}

export function withStorySource(source, map) {
  return (story, context) => {
    setStorySource(source, map, context);
    return story();
  };
}
