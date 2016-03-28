import SyncedStore from './synced_store';
import StoryStore from './story_store';
import ClientApi from './client_api';

const storyStore = new StoryStore();
const syncedStore = new SyncedStore(window);
const clientApi = new ClientApi({ storyStore, syncedStore });
syncedStore.init();

export function getStoryStore() {
  return storyStore;
}

export function getSyncedStore() {
  return syncedStore;
}

export const storiesOf = clientApi.storiesOf.bind(clientApi);
export const action = clientApi.action.bind(clientApi);

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
