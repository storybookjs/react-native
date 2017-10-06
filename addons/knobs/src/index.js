import { window } from 'global';
import deprecate from 'util-deprecate';
import addons from '@storybook/addons';

import { vueHandler } from './vue';
import { reactHandler } from './react';

import { knob, text, boolean, number, color, object, array, date, manager } from './base';

export { knob, text, boolean, number, color, object, array, date };

deprecate(() => {},
'Using @storybook/addon-knobs directly is discouraged, please use @storybook/addon-knobs/{{framework}}');

// generic higher-order component decorator for all platforms - usage is discouraged
// This file Should be removed with 4.0 release
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
