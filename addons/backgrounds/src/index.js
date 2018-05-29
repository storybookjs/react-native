import addons, { makeDecorator } from '@storybook/addons';
import CoreEvents from '@storybook/core-events';

import Events from './events';

let prevBackgrounds;

const subscription = () => () => {
  prevBackgrounds = null;
  addons.getChannel().emit(Events.UNSET);
};

export default makeDecorator({
  name: 'backgrounds',
  parameterName: 'backgrounds',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const backgrounds = parameters || options;

    if (backgrounds.length === 0) {
      return getStory(context);
    }

    if (prevBackgrounds !== backgrounds) {
      addons.getChannel().emit(Events.SET, backgrounds);
      prevBackgrounds = backgrounds;
    }
    addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);

    return getStory(context);
  },
});
