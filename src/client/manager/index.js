import 'es6-shim';
var renderManagerUI = require('@kadira/storybook-core');
var Provider = require('./provider');

var rootEl = document.getElementById('root');
renderManagerUI.default(rootEl, new (Provider.default)());
