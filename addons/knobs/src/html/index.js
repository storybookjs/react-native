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
  files,
  manager,
  makeDecorators,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, files };

export function button(name, callback) {
  return manager.knob(name, { type: 'button', value: Date.now(), callback, hideLabel: true });
}

function prepareComponent({ getStory, context, channel, knobStore }) {
  const wrapper = new WrapStory(getStory(context), channel, context, getStory, knobStore);

  return wrapper.getElement();
}

export const htmlHandler = (channel, knobStore) => getStory => context =>
  prepareComponent({ getStory, context, channel, knobStore });

export const { withKnobs, withKnobsOptions } = makeDecorators(htmlHandler, { escapeHTML: true });
