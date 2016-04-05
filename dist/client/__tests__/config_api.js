'use strict';

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _config_api = require('../config_api');

var _config_api2 = _interopRequireDefault(_config_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _global = global;
var describe = _global.describe;
var it = _global.it;


function buildMock(fields) {
  var obj = {};
  fields.forEach(function (field) {
    obj[field] = _sinon2.default.stub();
  });

  return obj;
}

function getConfigApi() {
  var storyStore = buildMock(['addStory', 'removeStoryKind', 'clean', 'hasStoryKind', 'dumpStoryBook', 'getStoryKinds', 'hasStory', 'getStories']);
  storyStore.hasStoryKind = function () {
    return true;
  };
  storyStore.hasStory = function () {
    return true;
  };

  var syncedStore = buildMock(['setData']);
  syncedStore.getData = function () {
    return {};
  };

  var c = new _config_api2.default({
    syncedStore: syncedStore,
    storyStore: storyStore
  });

  return c;
}

describe('client.ConfigApi', function () {
  describe('_renderError', function () {
    it('should send error stack and message to syncedStore', function () {
      var api = getConfigApi();
      api._syncedStore.getData = function () {
        return {};
      };

      var message = 'the-message';
      var stack = 'the-stack';
      var error = new Error(message);
      error.stack = stack;

      api._renderError(error);

      var capturedError = api._syncedStore.setData.args[0][0].error;
      (0, _chai.expect)(capturedError).to.deep.equal({ message: message, stack: stack });
    });
  });

  describe('_renderMain', function () {
    it('should run loaders if provided', function (done) {
      var api = getConfigApi();
      var loaders = done;
      api._renderMain(loaders);
    });

    it('should set error in syncedStore to null', function () {
      var api = getConfigApi();
      api._syncedStore.getData = function () {
        return { error: 'something-else' };
      };
      api._renderMain();

      var data = api._syncedStore.setData.args[0][0];
      (0, _chai.expect)(data.error).to.be.equal(null);
    });

    it('should get a dump of storyStore and send it to syncedStore', function () {
      var api = getConfigApi();
      var dump = { aa: 10 };
      api._storyStore.dumpStoryBook = function () {
        return dump;
      };
      api._renderMain();

      var data = api._syncedStore.setData.args[0][0];
      (0, _chai.expect)(data.storyStore).to.deep.equal(dump);
    });

    it('should set __updatedAt field with a updated value to syncedStore', function () {
      it('should get a dump of storyStore and send it to syncedStore', function () {
        var api = getConfigApi();
        api._renderMain();

        var data = api._syncedStore.setData.args[0][0];
        (0, _chai.expect)(data.__updatedAt <= Date.now()).to.deep.equal(true);
      });
    });

    it('should select a new kind if the current one is not available', function () {
      var api = getConfigApi();
      api._storyStore.hasStoryKind = function () {
        return false;
      };
      api._storyStore.getStoryKinds = function () {
        return ['abc'];
      };
      api._renderMain();

      var data = api._syncedStore.setData.args[0][0];
      (0, _chai.expect)(data.selectedKind).to.deep.equal('abc');
    });

    describe('if there is kind', function () {
      it('should select a new story if the current one is not available', function () {
        var api = getConfigApi();
        api._storyStore.hasStoryKind = function () {
          return true;
        };
        api._storyStore.hasStory = function () {
          return false;
        };
        api._storyStore.getStories = function () {
          return ['kkr'];
        };
        api._renderMain();

        var data = api._syncedStore.setData.args[0][0];
        (0, _chai.expect)(data.selectedStory).to.deep.equal('kkr');
      });
    });
  });

  describe('configure', function () {
    describe('initially', function () {
      it('should call _renderMain with loaders', function () {
        var api = getConfigApi();
        api._renderMain = _sinon2.default.stub();

        var loaders = function loaders() {};
        var m = {};
        api.configure(loaders, m);

        (0, _chai.expect)(api._renderMain.args[0][0]).to.be.equal(loaders);
      });

      describe('if caused an error', function () {
        it('should call _renderError with the error', function () {
          var api = getConfigApi();
          var error = new Error('horra');
          api._renderMain = function () {
            throw error;
          };
          api._renderError = _sinon2.default.stub();

          var loaders = function loaders() {};
          var m = {};
          api.configure(loaders, m);

          (0, _chai.expect)(api._renderError.args[0][0]).to.be.equal(error);
        });
      });
    });

    describe('with hot reload', function () {
      it('should call _renderMain with loaders', function (done) {
        var api = getConfigApi();
        api._renderMain = _sinon2.default.stub();

        var doAccept = null;
        var m = {
          hot: {
            accept: function accept(fn) {
              doAccept = fn;
            }
          }
        };
        api.configure(null, m);
        doAccept();

        setTimeout(function () {
          (0, _chai.expect)(api._renderMain.callCount).to.be.equal(2);
          done();
        }, 10);
      });

      describe('if caused an error', function () {
        it('should call _renderError with the error', function (done) {
          var error = new Error('error');
          var api = getConfigApi();
          api._renderMain = function () {
            throw error;
          };
          api._renderError = _sinon2.default.stub();

          var doAccept = null;
          var m = {
            hot: {
              accept: function accept(fn) {
                doAccept = fn;
              }
            }
          };
          api.configure(null, m);
          doAccept();

          setTimeout(function () {
            (0, _chai.expect)(api._renderError.callCount).to.be.equal(2);
            done();
          }, 10);
        });
      });
    });
  });
});