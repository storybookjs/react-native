import addons from '@storybook/addons';
import window from 'global';
import './WrapStory.html';

import { knob, text, boolean, number, color, object, array, date, select, manager } from '../base';

export { knob, text, boolean, number, color, object, array, date, select };

export function button(name, callback) {
  return manager.knob(name, { type: 'button', value: Date.now(), callback, hideLabel: true });
}

function prepareComponent({ getStory, context, channel, knobStore }) {
  const WrapStory = window.customElements.get('wrap-story');
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
