/* global window */

import { createStore } from 'redux';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import qs from 'qs';
import { StoryStore, ClientApi, ConfigApi, Actions, reducer } from '@storybook/core/client';
import init from './init';
import render from './render';

// check whether we're running on node/browser
const { navigator } = global;
const isBrowser =
  navigator &&
  navigator.userAgent !== 'storyshots' &&
  !(navigator.userAgent.indexOf('Node.js') > -1);

const storyStore = new StoryStore();
const reduxStore = createStore(reducer);

const createWrapperComponent = Target => ({
  functional: true,
  render(h, c) {
    return h(Target, c.data, c.children);
  },
});
const decorateStory = (getStory, decorators) =>
  decorators.reduce(
    (decorated, decorator) => context => {
      const story = () => decorated(context);
      const decoratedStory = decorator(story, context);
      decoratedStory.components = decoratedStory.components || {};
      decoratedStory.components.story = createWrapperComponent(story());
      return decoratedStory;
    },
    getStory
  );
const context = { storyStore, reduxStore, decorateStory };

if (isBrowser) {
  const queryParams = qs.parse(window.location.search.substring(1));
  const channel = createChannel({ page: 'preview' });
  channel.on('setCurrentStory', data => {
    reduxStore.dispatch(Actions.selectStory(data.kind, data.story));
  });
  Object.assign(context, { channel, window, queryParams });
  addons.setChannel(channel);
  init(context);
}

const clientApi = new ClientApi(context);

// do exports
export const storiesOf = clientApi.storiesOf.bind(clientApi);
export const setAddon = clientApi.setAddon.bind(clientApi);
export const addDecorator = clientApi.addDecorator.bind(clientApi);
export const clearDecorators = clientApi.clearDecorators.bind(clientApi);
export const getStorybook = clientApi.getStorybook.bind(clientApi);

const configApi = new ConfigApi({ ...context, clearDecorators });
export const configure = configApi.configure.bind(configApi);

// initialize the UI
const renderUI = () => {
  if (isBrowser) {
    render(context);
  }
};

reduxStore.subscribe(renderUI);
