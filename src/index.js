import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './context.js';

import apiModule from './modules/api';
import shortcutsModule from './modules/shortcuts';
import uiModule from './modules/ui';
import providerModule from './modules/provider';

export default function (domNode, provider) {
  const reducer = combineReducers({
    ...apiModule.reducers,
    ...shortcutsModule.reducers,
    ...providerModule.reducers,
    ...uiModule.reducers,
  });

  const reduxStore = createStore(reducer);

  const context = buildContext(reduxStore, domNode, provider);
  const app = createApp(context);

  app.loadModule(apiModule);
  app.loadModule(shortcutsModule);
  app.loadModule(providerModule);
  app.loadModule(uiModule);

  app.init();
}
