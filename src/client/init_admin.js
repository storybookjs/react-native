import renderUI from './ui/admin';
import { getSyncedStore } from './';

const syncedStore = getSyncedStore();

syncedStore.watchData(data => {
  renderUI(data);
});
renderUI(syncedStore.getData());
