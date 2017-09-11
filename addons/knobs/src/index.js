import { window } from 'global';
import deprecate from 'util-deprecate';
import addons from '@storybook/addons';

import { vueHandler } from './vue';
import { reactHandler } from './react';

import { knob, text, boolean, number, color, object, array, date, manager } from './base';

export { knob, text, boolean, number, color, object, array, date };

deprecate(
  () => {},
  'Using @storybook/addon-knobs directly is discouraged, please use @storybook/addon-knobs/{{framework}}'
);

// "Higher order component" / wrapper style API
// In 3.3, this will become `withKnobs`, once our decorator API supports it.
// See https://github.com/storybooks/storybook/pull/1527
function wrapperKnobs(options) {
  const channel = addons.getChannel();
  manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  switch (window.STORYBOOK_ENV) {
    case 'vue': {
      return vueHandler(channel, manager.knobStore);
    }
    case 'react': {
      return reactHandler(channel, manager.knobStore);
    }
    default: {
      return reactHandler(channel, manager.knobStore);
    }
  }
}

export function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

export function withKnobsOptions(options = {}) {
  return (storyFn, context) => wrapperKnobs(options)(storyFn)(context);
}
