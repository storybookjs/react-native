import addons from '@storybook/addons';

import A11yManager from './A11yManager';
import * as shared from './shared';

const manager = new A11yManager();
let axeOptions = {};

function checkA11y(storyFn, context) {
  const channel = addons.getChannel();
  return manager.wrapStory(channel, storyFn, context, axeOptions);
}

function configureA11y(options = {}) {
  axeOptions = options;
}

export { checkA11y, shared, configureA11y };
