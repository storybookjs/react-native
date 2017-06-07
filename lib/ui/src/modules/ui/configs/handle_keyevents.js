import { window } from 'global';
import keyEvents from '../../../libs/key_events';

export default function(actions) {
  window.onkeydown = e => {
    const parsedEvent = keyEvents(e);
    if (parsedEvent) {
      actions.shortcuts.handleEvent(parsedEvent);
    }
  };
}
