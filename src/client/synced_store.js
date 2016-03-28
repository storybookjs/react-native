import createPageBus from 'page-bus';
import stringify from 'json-stringify-safe';
import QS from 'query-string';
import UUID from 'uuid';

export default class Data {
  constructor(window) {
    this._window = window;
    this._parsedQs = QS.parse(window.location.search);

    // We need to check whether we are inside a iframe or not.
    // This is used by here and as well as in the UI
    this._iframeMode = Boolean(this._parsedQs.dataId);

    // We need to create a unique Id for each page. We need to communicate
    // using this id as a namespace. Otherwise, each every iframe will get the
    // data.
    //  We create a new UUID if this is main page. Then, this is used by UI to
    //  create queryString param when creating the iframe.
    //  If we are in the iframe, we'll get it from the queryString.
    this._dataId = this._iframeMode ? this._parsedQs.dataId : UUID.v4();
    this._data = {
      iframeMode: this._iframeMode,
      dataId: this._dataId,
    };

    this._handlers = [];
  }

  _onData(dataString) {
    const d = JSON.parse(dataString);
    this._data = {
      ...d,
      iframeMode: this._iframeMode,
    };

    this._handlers.forEach(handler => {
      handler(this.getData());
    });
  }

  init() {
    this._bus = createPageBus();
    // listen to the bus and apply
    this._bus.on(this.getDataKey(), this._onData.bind(this));
    // do initial render
    this._handlers.forEach(handler => handler(this.getData()));
  }

  getDataKey() {
    return `data-${this._data.dataId}`;
  }

  getData() {
    return { ...this._data };
  }

  setData(fields) {
    Object
      .keys(fields)
      .forEach(key => {
        this._data[key] = fields[key];
      });

    this._data.__lastUpdated = Date.now();
    // In page-bus, we must send non-identical data.
    // Otherwise, it'll cache and won't trigger.
    // That's why we are setting the __lastUpdated value here.
    this._bus.emit(this.getDataKey(), stringify(this.getData()));
    this._handlers.forEach(handler => handler(this.getData()));
  }

  watchData(fn) {
    this._handlers.push(fn);
    return () => {
      const index = this._handlers.indexOf(fn);
      this._handlers.splice(index, 1);
    };
  }
}
