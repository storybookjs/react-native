import addons from '@storybook/addons';

import A11yManager from './A11yManager';
import * as shared from './shared';

const manager = new A11yManager();

function checkA11y(storyFn, context) {
  const channel = addons.getChannel();
  return manager.wrapStory(channel, storyFn, context);
}

export { checkA11y, shared };
