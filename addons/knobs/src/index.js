import { window } from 'global';
import deprecate from 'util-deprecate';
import addons from '@storybook/addons';
import KnobManager from './KnobManager';
import { vueHandler } from './vue';
import { reactHandler } from './react';

const channel = addons.getChannel();
const manager = new KnobManager(channel);

export function knob(name, options) {
  return manager.knob(name, options);
}

export function text(name, value) {
  return manager.knob(name, { type: 'text', value });
}

export function boolean(name, value) {
  return manager.knob(name, { type: 'boolean', value });
}

export function number(name, value, options = {}) {
  const defaults = {
    range: false,
    min: 0,
    max: 10,
    step: 1,
  };

  const mergedOptions = { ...defaults, ...options };

  const finalOptions = {
    ...mergedOptions,
    type: 'number',
    value,
  };

  return manager.knob(name, finalOptions);
}

export function color(name, value) {
  return manager.knob(name, { type: 'color', value });
}

export function object(name, value) {
  return manager.knob(name, { type: 'object', value });
}

export function select(name, options, value) {
  return manager.knob(name, { type: 'select', options, value });
}

export function array(name, value, separator = ',') {
  return manager.knob(name, { type: 'array', value, separator });
}

export function date(name, value = new Date()) {
  const proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue });
}

function oldKnobs(storyFn, context) {
  return reactHandler(channel, manager.knobStore)(storyFn)(context);
}

function oldKnobsWithOptions(options = {}) {
  return (...args) => {
    channel.emit('addon:knobs:setOptions', options);

    return oldKnobs(...args);
  };
}

Object.defineProperty(exports, 'withKnobs', {
  configurable: true,
  enumerable: true,
  get: deprecate(
    () => oldKnobs,
    '@storybook/addon-knobs withKnobs decorator is deprecated, use addonKnobs() instead. See https://github.com/storybooks/storybook/tree/master/addons/knobs'
  ),
});

Object.defineProperty(exports, 'withKnobsOptions', {
  configurable: true,
  enumerable: true,
  get: deprecate(
    () => oldKnobsWithOptions,
    '@storybook/addon-knobs withKnobsOptions decorator is deprecated, use addonKnobs() instead. See https://github.com/storybooks/storybook/tree/master/addons/knobs'
  ),
});

export function addonKnobs(options) {
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
