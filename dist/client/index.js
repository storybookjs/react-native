'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.linkTo = exports.action = exports.storiesOf = undefined;
exports.getStoryStore = getStoryStore;
exports.getSyncedStore = getSyncedStore;

var _synced_store = require('./synced_store');

var _synced_store2 = _interopRequireDefault(_synced_store);

var _story_store = require('./story_store');

var _story_store2 = _interopRequireDefault(_story_store);

var _client_api = require('./client_api');

var _client_api2 = _interopRequireDefault(_client_api);

var _config_api = require('./config_api');

var _config_api2 = _interopRequireDefault(_config_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storyStore = new _story_store2.default();
var syncedStore = new _synced_store2.default(window);
var clientApi = new _client_api2.default({ storyStore: storyStore, syncedStore: syncedStore });
var configApi = new _config_api2.default({ storyStore: storyStore, syncedStore: syncedStore });
syncedStore.init();

function getStoryStore() {
  return storyStore;
}

function getSyncedStore() {
  return syncedStore;
}

var storiesOf = exports.storiesOf = clientApi.storiesOf.bind(clientApi);
var action = exports.action = clientApi.action.bind(clientApi);
var linkTo = exports.linkTo = clientApi.linkTo.bind(clientApi);
var configure = exports.configure = configApi.configure.bind(configApi);