const jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.localStorage = global.window.localStorage = {
  _data       : {},
  setItem     : function(id, val) { return this._data[id] = String(val); },
  getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
  removeItem  : function(id) { return delete this._data[id]; },
  clear       : function() { return this._data = {}; }
};

window.matchMedia = () => ({ matches: true });