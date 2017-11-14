import React from 'react';
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

export const reactHandler = (channel, knobStore) => getStory => context => {
  const initialContent = getStory(context);
  const props = { context, storyFn: getStory, channel, knobStore, initialContent };
  return <WrapStory {...props} />;
};

function wrapperKnobs(options) {
  const channel = addons.getChannel();
  manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return reactHandler(channel, manager.knobStore);
}

export function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

export function withKnobsOptions(options = {}) {
  return (storyFn, context) => wrapperKnobs(options)(storyFn)(context);
}
