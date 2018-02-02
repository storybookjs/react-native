import addons from '@storybook/addons';
import { EVENT_ID } from './';

function setStorySource(source, map, context) {
  const channel = addons.getChannel();

  channel.emit(EVENT_ID, {
    source,
    map,
    context,
  });
}

export function withStorySource(source, map) {
  return (story, context) => {
    setStorySource(source, map, context);
    return story();
  };
}
