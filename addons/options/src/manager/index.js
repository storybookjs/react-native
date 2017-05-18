import addons from '@storybook/addons';
import { ADDON_ID, EVENT_ID } from '../shared';

// init function will be executed once when the storybook loads for the
// first time. This is a good place to add channel listeners and panels.
export function init() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    channel.on(EVENT_ID, data => {
      api.setOptions(data.options);
    });
  });
}
