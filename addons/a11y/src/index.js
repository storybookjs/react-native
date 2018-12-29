import { document } from 'global';
import axe from 'axe-core';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';

import { CHECK_EVENT_ID, REQUEST_CHECK_EVENT_ID } from './shared';

const config = {
  axeOptions: {},
  contextElementId: '',
};

export const configureA11y = (axeOptions = {}, contextElementId = '') => {
  config.axeOptions = axeOptions;
  config.contextElementId = contextElementId;
};

const runA11yCheck = () => {
  const channel = addons.getChannel();

  let axeContext = config.contextElementId;
  if (!axeContext) {
    const infoWrapper = document.getElementById('story-root');
    const wrapper = document.getElementById('root');
    axeContext = (infoWrapper && infoWrapper.children) || wrapper;
  }

  axe.reset();
  axe.configure(config.axeOptions);
  axe.run(axeContext).then(results => channel.emit(CHECK_EVENT_ID, results), logger.error);
};

const a11ySubscription = () => {
  const channel = addons.getChannel();
  channel.on(REQUEST_CHECK_EVENT_ID, runA11yCheck);

  return () => {
    channel.removeListener(REQUEST_CHECK_EVENT_ID, runA11yCheck);
  };
};

export const checkA11y = story => {
  addons.getChannel().emit(Events.REGISTER_SUBSCRIPTION, a11ySubscription);
  return story();
};
