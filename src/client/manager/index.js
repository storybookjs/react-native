import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './configs/context.js';
import UUID from 'uuid';

import apiModule from './modules/api';
import shortcutsModule from './modules/shortcuts';
import previewModule from './modules/preview';
import uiModule from './modules/ui';

const dataId = UUID.v4();

const reducer = combineReducers({
  core: () => ({ dataId }),
  ...apiModule.reducers,
  ...shortcutsModule.reducers,
  ...previewModule.reducers,
  ...uiModule.reducers,
});

const reduxStore = createStore(reducer);
const context = buildContext(reduxStore);
const app = createApp(context);

app.loadModule(apiModule);
app.loadModule(shortcutsModule);
app.loadModule(previewModule);
app.loadModule(uiModule);

app.init();
