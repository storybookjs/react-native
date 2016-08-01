'use strict';

var _events = require('events');

var _storybookUi = require('@kadira/storybook-ui');

var _storybookUi2 = _interopRequireDefault(_storybookUi);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

require('./addons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var channel = new _events.EventEmitter();
var root = document.getElementById('react-app');
(0, _storybookUi2.default)(root, new _provider2.default(channel));