'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _chai = require('chai');

var _client_api = require('../client_api');

var _client_api2 = _interopRequireDefault(_client_api);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _global = global;
var describe = _global.describe;
var it = _global.it;


function getClientApi() {
  var syncedStore = { aa: 30 };
  var storyStore = { aa: 10 };
  var api = new _client_api2.default({ syncedStore: syncedStore, storyStore: storyStore });

  return api;
}

describe('client.ClientApi', function () {
  describe('constructor', function () {
    it('should set _syncedStore & _storyStore properly', function () {
      var syncedStore = { aa: 30 };
      var storyStore = { aa: 10 };
      var api = new _client_api2.default({ syncedStore: syncedStore, storyStore: storyStore });

      (0, _chai.expect)(api._syncedStore).to.be.equal(syncedStore);
      (0, _chai.expect)(api._storyStore).to.be.equal(storyStore);
    });
  });

  describe('storiesOf', function () {
    it('should return an api where we can add stories', function () {
      var api = getClientApi();
      var chainApi = api.storiesOf('kind');
      (0, _chai.expect)((0, _typeof3.default)(chainApi.add)).to.be.equal('function');
    });

    it('should remove story of the given kind, when hot module is disposing', function () {
      var doDispose = null;
      var hotModule = {
        hot: {
          dispose: function dispose(fn) {
            doDispose = fn;
          }
        }
      };

      var api = getClientApi();
      api._storyStore.removeStoryKind = _sinon2.default.stub();
      api.storiesOf('kind', hotModule);

      doDispose();

      (0, _chai.expect)(api._storyStore.removeStoryKind.args[0][0]).to.be.equal('kind');
    });
  });

  describe('storiesOf.add', function () {
    it('should add a given story', function () {
      var api = getClientApi();
      var handle = function handle() {};

      api._storyStore.addStory = _sinon2.default.stub();
      api.storiesOf('kind').add('name', handle);

      var args = api._storyStore.addStory.args[0];
      (0, _chai.expect)(args[0]).to.be.equal('kind');
      (0, _chai.expect)(args[1]).to.be.equal('name');
      (0, _chai.expect)(args[2]).to.be.equal(handle);
    });

    it('should support method chaining', function () {
      var api = getClientApi();
      var handle = function handle() {};

      api._storyStore.addStory = _sinon2.default.stub();
      api.storiesOf('kind').add('name', handle).add('name2', handle);
    });
  });

  describe('action', function () {
    it('should send action info to the syncedStore', function () {
      var api = getClientApi();
      api._syncedStore.getData = function () {
        return { actions: [] };
      };
      api._syncedStore.setData = _sinon2.default.stub();

      var cb = api.action('hello');
      cb(10, 20);

      var args = api._syncedStore.setData.args[0];
      (0, _chai.expect)(args[0].actions).to.be.deep.equal([{
        name: 'hello',
        args: [10, 20]
      }]);
    });

    it('should only keep the latest 5 actions in the syncedStore', function () {
      var api = getClientApi();
      api._syncedStore.getData = function () {
        return {
          actions: [50, 40, 30, 20, 10]
        };
      };
      api._syncedStore.setData = _sinon2.default.stub();

      var cb = api.action('hello');
      cb(10, 20);

      var args = api._syncedStore.setData.args[0];
      (0, _chai.expect)(args[0].actions).to.be.deep.equal([{
        name: 'hello',
        args: [10, 20]
      }, 50, 40, 30, 20]);
    });

    it('should replace any Synthetic Event with it\'s name', function () {
      var api = getClientApi();
      api._syncedStore.getData = function () {
        return { actions: [] };
      };
      api._syncedStore.setData = _sinon2.default.stub();

      var SyntheticAction = function SyntheticAction() {
        (0, _classCallCheck3.default)(this, SyntheticAction);
      };

      var cb = api.action('hello');
      cb(new SyntheticAction());

      var args = api._syncedStore.setData.args[0];
      (0, _chai.expect)(args[0].actions).to.be.deep.equal([{
        name: 'hello',
        args: ['[SyntheticAction]']
      }]);
    });
  });
});