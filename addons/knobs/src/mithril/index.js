/** @jsx m */

// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'mithril';
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
  selectV2,
  button,
  manager,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, selectV2, button };

export const mithrilHandler = (channel, knobStore) => getStory => context => {
  const initialContent = getStory(context);
  const props = { context, storyFn: getStory, channel, knobStore, initialContent };
  return {
    view: () => <WrapStory {...props} />,
  };
};

function wrapperKnobs(options) {
  const channel = addons.getChannel();
  manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return mithrilHandler(channel, manager.knobStore);
}

export function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

export function withKnobsOptions(options = {}) {
  return (storyFn, context) => wrapperKnobs(options)(storyFn)(context);
}
