import addons, { makeDecorator } from '@storybook/addons';

import { SET_OPTIONS } from './shared';
import { manager, registerKnobs } from './registerKnobs';
import { Knob, KnobType, Mutable } from './type-defs';
import {
  NumberTypeKnobOptions,
  ButtonTypeOnClickProp,
  RadiosTypeOptionsProp,
  SelectTypeOptionsProp,
  SelectTypeKnobValue,
  OptionsTypeKnobValue,
  OptionsTypeOptionsProp,
  OptionsTypeKnobSingleValue,
  OptionsKnobOptions,
  RadiosTypeKnobValue,
  ArrayTypeKnobValue,
} from './components/types';

export function knob<T extends KnobType, V = Mutable<Knob<T>['value']>>(
  name: string,
  options: Knob<T>
): V {
  return manager.knob(name, options) as V;
}

export function text(name: string, value: string, groupId?: string) {
  return manager.knob(name, { type: 'text', value, groupId });
}

export function boolean(name: string, value: boolean, groupId?: string) {
  return manager.knob(name, { type: 'boolean', value, groupId });
}

export function number(
  name: string,
  value: number,
  options: NumberTypeKnobOptions = {},
  groupId?: string
) {
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
    type: 'number' as 'number',
    ...mergedOptions,
    value,
    groupId,
  };

  return manager.knob(name, finalOptions);
}

export function color(name: string, value: string, groupId?: string) {
  return manager.knob(name, { type: 'color', value, groupId });
}

export function object<T>(name: string, value: T, groupId?: string): T {
  return manager.knob(name, { type: 'object', value, groupId });
}

export function select<T extends SelectTypeKnobValue>(
  name: string,
  options: SelectTypeOptionsProp<T>,
  value: T,
  groupId?: string
): T {
  return manager.knob(name, {
    type: 'select',
    selectV2: true,
    options: options as SelectTypeOptionsProp,
    value,
    groupId,
  }) as T;
}

export function radios<T extends RadiosTypeKnobValue>(
  name: string,
  options: RadiosTypeOptionsProp<T>,
  value: T,
  groupId?: string
): T {
  return manager.knob(name, { type: 'radios', options, value, groupId }) as T;
}

export function array(name: string, value: ArrayTypeKnobValue, separator = ',', groupId?: string) {
  return manager.knob(name, { type: 'array', value, separator, groupId });
}

export function date(name: string, value = new Date(), groupId?: string) {
  const proxyValue = value ? value.getTime() : new Date().getTime();
  return manager.knob(name, { type: 'date', value: proxyValue, groupId });
}

export function button(name: string, callback: ButtonTypeOnClickProp, groupId?: string) {
  return manager.knob(name, { type: 'button', callback, hideLabel: true, groupId });
}

export function files(name: string, accept: string, value: string[] = [], groupId?: string) {
  return manager.knob(name, { type: 'files', accept, value, groupId });
}

export function optionsKnob<T extends OptionsTypeKnobSingleValue>(
  name: string,
  valuesObj: OptionsTypeOptionsProp<T>,
  value: OptionsTypeKnobValue<T>,
  optionsObj: OptionsKnobOptions,
  groupId?: string
): T {
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
