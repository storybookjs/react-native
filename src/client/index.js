import SyncedStore from './synced_store';
import StoryStore from './story_store';

const storyStore = new StoryStore();
const syncedStore = new SyncedStore(window);

export function getStoryStore() {
  return storyStore;
}

export function getSyncedStore() {
  return syncedStore;
}

export function storiesOf(kind, m) {
  m.hot.dispose(() => {
    storyStore.removeStoryKind(kind);
  });

  function add(storyName, fn) {
    storyStore.addStory(kind, storyName, fn);
    return { add };
  }

  return { add };
}

export function action(name) {
  return function (...args) {
    const newArgs = { ...args };
    let { actions = [] } = syncedStore.getData();

    // Remove events from the args. Otherwise, it creates a huge JSON string.
    if (
      newArgs[0] &&
      newArgs[0].constructor &&
      /Synthetic/.test(newArgs[0].constructor.name)
    ) {
      newArgs[0] = `[${newArgs[0].constructor.name}]`;
    }

    actions = [{ name, newArgs }].concat(actions.slice(0, 5));
    syncedStore.setData({ actions });
  };
}

export function renderMain() {
  const data = syncedStore.getData();
  data.error = null;
  data.__updatedAt = Date.now();
  data.storybook = storyStore.dumpStoryBook();

  if (!storyStore.hasStoryKind(data.selectedKind)) {
    data.selectedKind = storyStore.getStoryKinds()[0];
  }

  if (storyStore.hasStoryKind(data.selectedKind)) {
    if (!storyStore.hasStory(data.selectedKind, data.selectedStory)) {
      data.selectedStory = storyStore.getStories(data.selectedKind, data.selectedStory)[0];
    }
  }

  syncedStore.setData(data);
}

export const renderError = (e) => {
  const data = syncedStore.getData();
  const { stack, message } = e;
  data.error = { stack, message };

  syncedStore.setData(data);
};

export function configure(loaders, module) {
  const render = () => {
    function renderApp() {
      loaders();
      renderMain();
    }

    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  if (module.hot) {
    module.hot.accept(() => {
      setTimeout(render);
    });
  }

  render();
}

syncedStore.init();
