import renderUI from './ui/preview';
import { getSyncedStore } from './';

getSyncedStore().watchData(renderUI);
