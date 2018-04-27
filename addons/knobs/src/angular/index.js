import { prepareComponent } from './helpers';

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
  files,
  makeDecorators,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, selectV2, button, files };

export const angularHandler = (channel, knobStore) => getStory => context =>
  prepareComponent({ getStory, context, channel, knobStore });

export const { withKnobs, withKnobsOptions } = makeDecorators(angularHandler, { escapeHTML: true });
