import addons from '@storybook/addons';
import { EVENT_ID } from './';

function setStorySource(source, context) {
  const channel = addons.getChannel();

  channel.emit(EVENT_ID, {
    source,
    context,
  });
}

export function withStorySource(source) {
  return (story, context) => {
    setStorySource(source, context);
    return story();
  };
}
