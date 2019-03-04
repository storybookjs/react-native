import { addons, makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import deprecate from 'util-deprecate';

import { REGISTER_SUBSCRIPTION } from '@storybook/core-events';
import { EVENTS } from './constants';
import { BackgroundConfig } from './models';

let prevBackgrounds: BackgroundConfig[];

const subscription = () => () => {
  prevBackgrounds = null;
  addons.getChannel().emit(EVENTS.UNSET);
};

export const withBackgrounds = makeDecorator({
  name: 'withBackgrounds',
  parameterName: 'backgrounds',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory: StoryGetter, context: StoryContext, { options, parameters }: WrapperSettings) => {
    const data = parameters || options || [];
    const backgrounds = Array.isArray(data) ? data : Object.values(data);

    if (backgrounds.length === 0) {
      return getStory(context);
    }

    if (prevBackgrounds !== backgrounds) {
      addons.getChannel().emit(EVENTS.SET, backgrounds);
      prevBackgrounds = backgrounds;
    }
    addons.getChannel().emit(REGISTER_SUBSCRIPTION, subscription);

    return getStory(context);
  },
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
