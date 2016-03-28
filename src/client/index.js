import SyncedStore from './synced_store';
import StoryStore from './story_store';
import ClientApi from './client_api';
import ConfigApi from './config_api';

const storyStore = new StoryStore();
const syncedStore = new SyncedStore(window);
const clientApi = new ClientApi({ storyStore, syncedStore });
const configApi = new ConfigApi({ storyStore, syncedStore });
syncedStore.init();

export function getStoryStore() {
  return storyStore;
}

export function getSyncedStore() {
  return syncedStore;
}

export const storiesOf = clientApi.storiesOf.bind(clientApi);
export const action = clientApi.action.bind(clientApi);
export const configure = configApi.configure.bind(configApi);
