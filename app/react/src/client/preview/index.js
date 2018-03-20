import { createStore } from 'redux';
import addons from '@storybook/addons';
import { navigator, window } from 'global';
import createChannel from '@storybook/channel-postmessage';
import { handleKeyboardShortcuts } from '@storybook/ui/dist/libs/key_events';
import {
  StoryStore,
  ClientApi,
  ConfigApi,
  Actions,
  reducer,
  syncUrlWithStore,
} from '@storybook/core/client';

import render from './render';

// check whether we're running on node/browser
const isBrowser =
  navigator &&
  navigator.userAgent &&
  navigator.userAgent !== 'storyshots' &&
  !(navigator.userAgent.indexOf('Node.js') > -1) &&
  !(navigator.userAgent.indexOf('jsdom') > -1);

const storyStore = new StoryStore();
const reduxStore = createStore(reducer);
const context = { storyStore, reduxStore };

const clientApi = new ClientApi(context);
export const { storiesOf, setAddon, addDecorator, clearDecorators, getStorybook } = clientApi;

let channel;
if (isBrowser) {
  // setup preview channel
  channel = createChannel({ page: 'preview' });
  channel.on('setCurrentStory', data => {
    reduxStore.dispatch(Actions.selectStory(data.kind, data.story));
  });
  addons.setChannel(channel);
  Object.assign(context, { channel });

  syncUrlWithStore(reduxStore);

  // Handle keyboard shortcuts
  window.onkeydown = handleKeyboardShortcuts(channel);
}

// Provide access to external scripts if `window` is defined.
// NOTE this is different to isBrowser, primarily for the JSDOM use case
if (typeof window !== 'undefined') {
  window.__STORYBOOK_CLIENT_API__ = clientApi;
  window.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
}

const configApi = new ConfigApi({ clearDecorators, ...context });
export const { configure } = configApi;

// initialize the UI
const renderUI = () => {
  if (isBrowser) {
    render(context);
  }
};

reduxStore.subscribe(renderUI);

export const forceReRender = () => render(context, true);
