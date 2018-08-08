import { document } from 'global';
import keyEvents from './libs/key_events';

export default ({ store }) => {
  const onKeyDown = e => {
    const parsedEvent = keyEvents(e);
    if (parsedEvent) {
      store.handleEvent(parsedEvent);
    }
  };

  document.addEventListener('keydown', onKeyDown);
};
