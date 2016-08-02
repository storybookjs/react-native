import UUID from 'uuid';
import createPageBus from 'page-bus';

export default class Channel {
  constructor(dataId) {
    this._dataId = dataId || UUID.v4();
    this._pageBus = createPageBus();
    this._listeners = {};
  }

  getDataId() {
    return this._dataId;
  }

  on(type, handler) {
    const listener = p => handler(JSON.parse(p));
    // TODO add listener to a map[handler]listener
    this._pageBus.on(`${this._dataId}.${type}`, listener);
  }

  emit(type, data) {
    const payload = JSON.stringify(data);
    this._pageBus.emit(`${this._dataId}.${type}`, payload);
  }

  removeListener(/* type, handler */) {
    // TODO get listener from a map[handler]listener
    // this._pageBus.removeListener(type, listener);
  }
}
