import { addons, makeDecorator } from '@storybook/addons';
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
  wrapper: (getStory, context, { options, parameters }) => {
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

export default deprecate(
  withBackgrounds,
  'The default export of @storybook/addon-backgrounds is deprecated, please `import { withBackgrounds }` instead'
);

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
