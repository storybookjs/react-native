import deprecate from 'util-deprecate';
import KnobManager from './KnobManager';

export const manager = new KnobManager();

export function knob(name, options) {
  return manager.knob(name, options);
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

export const select = deprecate(
  (name, options, value, groupId) =>
    manager.knob(name, { type: 'select', options, value, groupId }),
  'in v4 keys/values of the options argument are reversed'
);

export function selectV2(name, options, value, groupId) {
  return manager.knob(name, { type: 'select', selectV2: true, options, value, groupId });
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
