import { createStore, combineReducers } from 'redux';
import { createApp } from 'mantra-core';

import buildContext from './context.js';
import shortcutsModule from './modules/shortcuts';
import apiModule from './modules/api';
import uiModule from './modules/ui';
import { setContext, setActions } from './compose';

export class Provider {
  renderPreview(selectedKind, selectedStory) { // eslint-disable-line no-unused-vars
    throw new Error('Provider.renderPreview() is not implemented!');
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
    ...shortcutsModule.reducers,
    ...apiModule.reducers,
    ...uiModule.reducers,
  });

  const devTools = window.devToolsExtension && window.devToolsExtension();
  const reduxStore = createStore(reducer, devTools);

  const context = buildContext(reduxStore, domNode, provider);
  const app = createApp(context);

  app.loadModule(shortcutsModule);
  app.loadModule(apiModule);
  app.loadModule(uiModule);

  setContext(context);
  setActions(app._bindContext(app.actions));

  app.init();
}
