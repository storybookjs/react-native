import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './context.js';

import shortcutsModule from './modules/shortcuts';
import apiModule from './modules/api';
import uiModule from './modules/ui';

export class Provider {
  renderPreview() {
    throw new Error('Provider.enderPreview() is not implemented!');
  }

  handleAPI() {
    throw new Error('Provider.handleAPI() is not implemented!');
  }
}

export default function (domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  const reducer = combineReducers({
    ...shortcutsModule.reducers,
    ...apiModule.reducers,
    ...uiModule.reducers,
  });

  const reduxStore = createStore(reducer);

  const context = buildContext(reduxStore, domNode, provider);
  const app = createApp(context);

  app.loadModule(shortcutsModule);
  app.loadModule(apiModule);
  app.loadModule(uiModule);

  app.init();
}
