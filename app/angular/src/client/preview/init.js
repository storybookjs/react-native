import keyEvents from '@storybook/ui/dist/libs/key_events';
import { selectStory } from './actions';

export default function(context) {
  const { queryParams, reduxStore, window, channel } = context;
  // set the story if correct params are loaded via the URL.
  if (queryParams.selectedKind) {
    reduxStore.dispatch(selectStory(queryParams.selectedKind, queryParams.selectedStory));
  }

  // Handle keyEvents and pass them to the parent.
  window.onkeydown = e => {
    const parsedEvent = keyEvents(e);
    if (parsedEvent) {
      channel.emit('applyShortcut', { event: parsedEvent });
    }
  };
}
