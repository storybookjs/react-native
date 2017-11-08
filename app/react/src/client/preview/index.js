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
const context = { storyStore, reduxStore };

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
export const { storiesOf, setAddon, addDecorator, clearDecorators, getStorybook } = clientApi;

const configApi = new ConfigApi({ clearDecorators, ...context });
export const { configure } = configApi;

// initialize the UI
const renderUI = () => {
  if (isBrowser) {
    render(context);
  }
};

reduxStore.subscribe(renderUI);
