import registerKnobs from './registerKnobs';

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

function prepareComponent({ getStory, context }) {
  registerKnobs();

  return getStory(context);
}

export const htmlHandler = () => getStory => context => prepareComponent({ getStory, context });

export const { withKnobs, withKnobsOptions } = makeDecorators(htmlHandler, { escapeHTML: true });
