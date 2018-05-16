import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';

import Events from './events';

let prevBackgrounds;

const subscription = () => () => {
  prevBackgrounds = null;
  addons.getChannel().emit(Events.UNSET);
};

export default backgrounds => story => {
  if (prevBackgrounds !== backgrounds) {
    addons.getChannel().emit(Events.SET, backgrounds);
    prevBackgrounds = backgrounds;
  }
  addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
  return story();
};
