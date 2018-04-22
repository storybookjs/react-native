import React from 'react';

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
  files,
  makeDecorators,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, selectV2, button, files };

export const reactHandler = (channel, knobStore) => getStory => context => {
  const initialContent = getStory(context);
  const props = { context, storyFn: getStory, channel, knobStore, initialContent };
  return <WrapStory {...props} />;
};

export const { withKnobs, withKnobsOptions } = makeDecorators(reactHandler);
