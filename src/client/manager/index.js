import 'es6-shim';
import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './configs/context.js';
import UUID from 'uuid';

import apiModule from '@kadira/storybook-core/dist/modules/api';
import shortcutsModule from '@kadira/storybook-core/dist/modules/shortcuts';
import uiModule from '@kadira/storybook-core/dist/modules/ui';
import previewModule from './modules/preview';
import Preview from './modules/preview/containers/preview';

const dataId = UUID.v4();

const reducer = combineReducers({
  core: () => ({ dataId }),
  ...apiModule.reducers,
  ...shortcutsModule.reducers,
  ...previewModule.reducers,
  ...uiModule.reducers,
});

const reduxStore = createStore(reducer);
const context = buildContext(reduxStore, Preview);
const app = createApp(context);

app.loadModule(apiModule);
app.loadModule(shortcutsModule);
app.loadModule(previewModule);
app.loadModule(uiModule);

app.init();
