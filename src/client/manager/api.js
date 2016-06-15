import 'es6-shim';
import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './configs/context.js';

import apiModule from '@kadira/storybook-core/dist/modules/api';
import shortcutsModule from '@kadira/storybook-core/dist/modules/shortcuts';
import uiModule from '@kadira/storybook-core/dist/modules/ui';
import previewModule from './modules/preview';

export default function(domNode, provider) {
  const reducer = combineReducers({
    ...apiModule.reducers,
    ...shortcutsModule.reducers,
    ...previewModule.reducers,
    ...uiModule.reducers,
  });

  const reduxStore = createStore(reducer);

  const context = buildContext(reduxStore, domNode, provider);
  const app = createApp(context);

  app.loadModule(apiModule);
  app.loadModule(shortcutsModule);
  app.loadModule(previewModule);
  app.loadModule(uiModule);

  app.init();
}
