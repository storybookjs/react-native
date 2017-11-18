import addons from '@storybook/addons';
import WrapStory from './WrapStory';

import {
  knob,
  text,
  boolean,
  number,
  color,
  object,
  array,
  date,
  select,
  button,
  manager,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, button };

function prepareComponent({ getStory, context, channel, knobStore }) {
  return new WrapStory(getStory(context), channel, context, getStory, knobStore);
}

export const polymerHandler = (channel, knobStore) => getStory => context =>
  prepareComponent({ getStory, context, channel, knobStore });

function wrapperKnobs(options) {
  const channel = addons.getChannel();
  manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return polymerHandler(channel, manager.knobStore);
}

export function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

export function withKnobsOptions(options = {}) {
  return (storyFn, context) => wrapperKnobs(options)(storyFn)(context);
}
