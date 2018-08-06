import addons, { makeDecorator } from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import Events, { ADDON_ID } from './constants';

let prevBackgrounds;

const subscription = () => () => {
  prevBackgrounds = null;
  addons.getChannel().emit(Events.UNSET);
};

export const withBackgrounds = makeDecorator({
  name: ADDON_ID,
  parameterName: 'backgrounds',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const data = parameters || options || [];
    const backgrounds = Array.isArray(data) ? data : Object.values(data);

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

export default deprecate(
  withBackgrounds,
  'The default export of @storybook/addon-backgrounds is deprecated, please `import { withBackgrounds }` instead'
);
