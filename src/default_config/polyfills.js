/* globals window, document */
const jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'storyshots',
};

global.localStorage = global.window.localStorage = {
  _data: {},
  setItem(id, val) { this._data[id] = String(val); },
  getItem(id) { return this._data[id] ? this._data[id] : undefined; },
  removeItem(id) { delete this._data[id]; },
  clear() { this._data = {}; },
};

window.matchMedia = () => ({ matches: true });
