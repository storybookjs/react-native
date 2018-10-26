import createStore from './store';
import getInitialState from './initial-state';

import initPanels from './panels';
import initStories from './stories';
import initUi from './ui';
import initOptions from './options';

// app state manager
const createManager = ({ history, provider }) => {
  const store = createStore(getInitialState());

  // ctx to pass to all managers
  const ctx = {
    store,
    history,
    provider,
  };

  return {
    store,
    getChannel() {
      return provider.channel;
    },
    getElements(type) {
      return provider.getElements(type);
    },
    ...initOptions(ctx),
    ...initUi(ctx),
    ...initPanels(ctx),
    ...initStories(ctx),
  };
};

export default createManager;
