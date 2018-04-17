import { createApp } from '@storybook/mantra-core';
import Podda from '@storybook/podda';

import buildContext from './context';
import shortcutsModule from './modules/shortcuts';
import apiModule from './modules/api';
import uiModule from './modules/ui';
import { setContext, setActions } from './compose';

export class Provider {
  renderPreview() {
    throw new Error('Provider.renderPreview() is not implemented!');
  }

  handleAPI() {
    throw new Error('Provider.handleAPI() is not implemented!');
  }
}

export default function(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  const defaultState = {
    ...shortcutsModule.defaultState,
    ...apiModule.defaultState,
    ...uiModule.defaultState,
  };
  const clientStore = new Podda(defaultState);
  clientStore.registerAPI('toggle', (store, key) => store.set(key, !store.get(key)));

  const context = buildContext(clientStore, domNode, provider);
  const app = createApp(context);

  app.loadModule(shortcutsModule);
  app.loadModule(apiModule);
  app.loadModule(uiModule);

  setContext(context);
  setActions(app._bindContext(app.actions)); // eslint-disable-line

  app.init();
}
