import StoryStore from './story_store';
import PageBus from './page_bus';
import ClientApi from './client_api';
import ConfigApi from './config_api';
import render from './render';
import qs from 'qs';
import init from './init';

import { createStore } from 'redux';
import reducer from './reducer';

const queryParams = qs.parse(window.location.search.substring(1));

const storyStore = new StoryStore();
const reduxStore = createStore(reducer);
const pageBus = new PageBus(queryParams.dataId, reduxStore);
pageBus.init();

const context = { storyStore, reduxStore, pageBus, window, queryParams };
const clientApi = new ClientApi(context);
const configApi = new ConfigApi(context);

init(context);

// do exports
export const storiesOf = clientApi.storiesOf.bind(clientApi);
export const action = clientApi.action.bind(clientApi);
export const linkTo = clientApi.linkTo.bind(clientApi);
export const configure = configApi.configure.bind(configApi);

// initialize the UI
const renderUI = () => {
  render(context);
};

reduxStore.subscribe(renderUI);
