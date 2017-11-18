import addons from '@storybook/addons';
import { document } from 'global';

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

function prepareComponent({ getStory, context, channel }) {
  let component = getStory(context);
  if (typeof component === 'string') {
    const tagName = /<([A-Za-z0-9-]{1,})>/.exec(component)[1];
    component = document.createElement(tagName);
  }
  channel.on('addon:knobs:knobChange', e => {
    component.setAttribute(e.name, e.value);
  });
  return component;
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
