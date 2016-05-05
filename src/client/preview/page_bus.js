import createPageBus from 'page-bus';
import { selectStory } from './actions';
import stringify from 'json-stringify-safe';

export default class PageBus {
  constructor(dataId, reduxStore) {
    this._reduxStore = reduxStore;
    this._dataId = dataId;
    this._pageBus = createPageBus();
  }

  _ensureDataId() {
    if (!this._dataId) {
      throw new Error('dataId is not supplied via queryString');
    }
  }

  _on(key, cb) {
    return this._pageBus.on(`${this._dataId}.${key}`, cb);
  }

  init() {
    this._ensureDataId();
    this._on('setCurrentStory', (payloadString) => {
      const { kind, story } = JSON.parse(payloadString);
      this._reduxStore.dispatch(selectStory(kind, story));
    });
  }

  emit(key, payload) {
    this._ensureDataId();
    const payloadString = stringify(payload);
    return this._pageBus.emit(`${this._dataId}.${key}`, payloadString);
  }
}
