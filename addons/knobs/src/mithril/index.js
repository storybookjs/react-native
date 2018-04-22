/** @jsx m */

// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'mithril';

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
  makeDecorators,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, selectV2, button };

export const mithrilHandler = (channel, knobStore) => getStory => context => {
  const initialContent = getStory(context);
  const props = { context, storyFn: getStory, channel, knobStore, initialContent };
  return {
    view: () => <WrapStory {...props} />,
  };
};

export const { withKnobs, withKnobsOptions } = makeDecorators(mithrilHandler);
