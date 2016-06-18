import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';
import buildContext from './context.js';

import apiModule from './modules/api';
import shortcutsModule from './modules/shortcuts';
import uiModule from './modules/ui';
import providerModule from './modules/provider';

export class Provider {
  renderPreview(selectedKind, selectedStory) { // eslint-disable-line no-unused-vars
    throw new Error('Provider.enderPreview() is not implemented!');
  }

  handleAPI(api) { // eslint-disable-line no-unused-vars
    throw new Error('Provider.handleAPI() is not implemented!');
  }
}

export default function (domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

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
