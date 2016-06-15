var initManagerUI = require('./api.js');
var Provider = require('./provider');

var rootEl = document.getElementById('root');
initManagerUI.default(rootEl, new (Provider.default)());
