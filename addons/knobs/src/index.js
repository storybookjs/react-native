import { window } from 'global';
import addons from '@storybook/addons';
import KnobManager from './KnobManager';
import { vueHandler } from './vue';
import { reactHandler } from './react';

const manager = new KnobManager();

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

export function button(name, callback) {
  return manager.knob(name, { type: 'button', callback, hideLabel: true });
}

// "Higher order component" / wrapper style API
// In 3.3, this will become `withKnobs`, once our decorator API supports it.
//   See https://github.com/storybooks/storybook/pull/1527
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
