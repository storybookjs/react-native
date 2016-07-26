import 'es6-shim';
import StoryStore from './story_store';
import PageBus from './page_bus';
import ClientApi from './client_api';
import ConfigApi from './config_api';
import render from './render';
import qs from 'qs';
import init from './init';

import { createStore } from 'redux';
import reducer from './reducer';

// check whether we're running on node/browser
const isBrowser = typeof window !== 'undefined';

const storyStore = new StoryStore();
const reduxStore = createStore(reducer);
const context = { storyStore, reduxStore };

if (isBrowser) {
  const queryParams = qs.parse(window.location.search.substring(1));
  const pageBus = new PageBus(queryParams.dataId, reduxStore);
  Object.assign(context, { pageBus, window, queryParams });
  pageBus.init();
  init(context);
}

const clientApi = new ClientApi(context);
const configApi = new ConfigApi(context);

// do exports
export const storiesOf = clientApi.storiesOf.bind(clientApi);
export const action = clientApi.action.bind(clientApi);
export const linkTo = clientApi.linkTo.bind(clientApi);
export const setAddon = clientApi.setAddon.bind(clientApi);
export const addDecorator = clientApi.addDecorator.bind(clientApi);
export const clearDecorators = clientApi.clearDecorators.bind(clientApi);
export const configure = configApi.configure.bind(configApi);

// initialize the UI
const renderUI = () => {
  if (isBrowser) {
    render(context);
  }
};

reduxStore.subscribe(renderUI);
