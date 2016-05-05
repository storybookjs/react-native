import { selectStory } from './actions';
import keyEvents from '../libs/key_events';

export default function (context) {
  const { queryParams, reduxStore, window, pageBus } = context;
  // set the story if correct params are loaded via the URL.
  if (queryParams.selectedKind) {
    reduxStore.dispatch(selectStory(queryParams.selectedKind, queryParams.selectedStory));
  }

  // Handle keyEvents and pass them to the parent.
  window.onkeydown = (e) => {
    const parsedEvent = keyEvents(e);
    if (parsedEvent) {
      pageBus.emit('applyShortcut', { event: parsedEvent });
    }
  };
}
