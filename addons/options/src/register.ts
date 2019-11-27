import addons from '@storybook/addons';
import deprecate from 'util-deprecate';
import EVENTS, { ADDON_ID } from './constants';

addons.register(
  ADDON_ID,
  deprecate(api => {
    const channel = addons.getChannel();

    channel.on(EVENTS.SET, data => {
      api.setOptions(data.options);
    });
  }, 'storybook-addon-options is deprecated and will stop working soon')
);
