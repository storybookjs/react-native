import { document, setTimeout } from 'global';
import axe from 'axe-core';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';

import { CHECK_EVENT_ID, RERUN_EVENT_ID } from './shared';

let axeOptions = {};

export const configureA11y = (options = {}) => {
  axeOptions = options;
};

const runA11yCheck = () => {
  const channel = addons.getChannel();
  const wrapper = document.getElementById('root');

  axe.reset();
  axe.configure(axeOptions);
  axe.run(wrapper).then(results => channel.emit(CHECK_EVENT_ID, results), logger.error);
};

const a11ySubscription = () => {
  const channel = addons.getChannel();
  channel.on(RERUN_EVENT_ID, runA11yCheck);
  return () => channel.removeListener(RERUN_EVENT_ID, runA11yCheck);
};

export const checkA11y = story => {
  addons.getChannel().emit(Events.REGISTER_SUBSCRIPTION, a11ySubscription);
  // We need to wait for rendering
  setTimeout(runA11yCheck, 0);
  return story();
};
