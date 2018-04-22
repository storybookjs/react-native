import window from 'global';
import './WrapStory.html';

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
  const WrapStory = window.customElements.get('wrap-story');
  return new WrapStory(getStory(context), channel, context, getStory, knobStore);
}

export const polymerHandler = (channel, knobStore) => getStory => context =>
  prepareComponent({ getStory, context, channel, knobStore });

export const { withKnobs, withKnobsOptions } = makeDecorators(polymerHandler, { escapeHTML: true });
