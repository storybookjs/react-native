import addons, { makeDecorator } from '@storybook/addons';

import { SET_OPTIONS } from './shared';

import { manager, registerKnobs } from './registerKnobs';

export function knob(name, optionsParam) {
  return manager.knob(name, optionsParam);
}

export function text(name, value, groupId) {
  return manager.knob(name, { type: 'text', value, groupId });
}

export function boolean(name, value, groupId) {
  return manager.knob(name, { type: 'boolean', value, groupId });
}

export function number(name, value, options = {}, groupId) {
  const rangeDefaults = {
    min: 0,
    max: 10,
    step: 1,
  };

  const mergedOptions = options.range
    ? {
        ...rangeDefaults,
        ...options,
      }
    : options;

  const finalOptions = {
    ...mergedOptions,
    type: 'number',
    value,
    groupId,
  };

  return manager.knob(name, finalOptions);
}

export function color(name, value, groupId) {
  return manager.knob(name, { type: 'color', value, groupId });
}

export function object(name, value, groupId) {
  return manager.knob(name, { type: 'object', value, groupId });
}

export function select(name, options, value, groupId) {
  return manager.knob(name, { type: 'select', selectV2: true, options, value, groupId });
}

export function radios(name, options, value, groupId) {
  return manager.knob(name, { type: 'radios', options, value, groupId });
}

export function array(name, value, separator = ',', groupId) {
  return manager.knob(name, { type: 'array', value, separator, groupId });
}

export function date(name, value = new Date(), groupId) {
  const proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue, groupId });
}

export function button(name, callback, groupId) {
  return manager.knob(name, { type: 'button', callback, hideLabel: true, groupId });
}

export function files(name, accept, value = []) {
  return manager.knob(name, { type: 'files', accept, value });
}

export function optionsKnob(name, valuesObj, value, optionsObj, groupId) {
  return manager.knob(name, { type: 'options', options: valuesObj, value, optionsObj, groupId });
}

const defaultOptions = {
  escapeHTML: true,
};

export const withKnobs = makeDecorator({
  name: 'withKnobs',
  parameterName: 'knobs',
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const storyOptions = parameters || options;
    const allOptions = { ...defaultOptions, ...storyOptions };

    const channel = addons.getChannel();
    manager.setChannel(channel);
    manager.setOptions(allOptions);
    channel.emit(SET_OPTIONS, allOptions);

    registerKnobs();
    return getStory(context);
  },
});

export * from './shared';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
