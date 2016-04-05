'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _synced_store = require('../synced_store');

var _synced_store2 = _interopRequireDefault(_synced_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _global = global;
var describe = _global.describe;
var it = _global.it;


function getSyncedData(dataId) {
  var window = {
    location: {},
    addEventListener: function addEventListener() {}
  };

  if (dataId) {
    window.location.search = '?dataId=' + dataId;
  }

  var syncedData = new _synced_store2.default(window);
  syncedData._bus = {};

  return syncedData;
}

describe('client.SyncedStore', function () {
  describe('normal mode', function () {
    it('should set the `iframeMode` as false', function () {
      var syncedData = getSyncedData();

      var data = syncedData.getData();
      (0, _chai.expect)(data.iframeMode).to.be.equal(false);
    });
    it('should set a random Id to dataId', function () {
      var syncedData = getSyncedData();

      var data = syncedData.getData();
      (0, _chai.expect)((0, _typeof3.default)(data.dataId)).to.be.equal('string');
    });
  });

  describe('iframe mode', function () {
    it('should get the dataId from the URL', function () {
      var currentDataId = _uuid2.default.v4();
      var syncedData = getSyncedData(currentDataId);

      var data = syncedData.getData();
      (0, _chai.expect)(data.dataId).to.be.equal(currentDataId);
    });

    it('should set the iframeMode as true', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var data = syncedData.getData();
      (0, _chai.expect)(data.iframeMode).to.be.equal(true);
    });
  });

  describe('watchData', function () {
    it('should add the handler to handlers', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var fn = function fn() {};
      syncedData.watchData(fn);
      var fnStored = syncedData._handlers.pop();
      (0, _chai.expect)(fnStored).to.be.equal(fn);
    });

    it('should remove the handler when the return function called', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var stop = syncedData.watchData(function () {});
      var countStart = syncedData._handlers.length;
      stop();
      var countEnd = syncedData._handlers.length;
      (0, _chai.expect)(countStart - countEnd).to.be.equal(1);
    });
  });

  describe('setData', function () {
    it('should emit data to the pageBus', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var kkr = _uuid2.default.v4();
      var originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = _sinon2.default.stub();
      syncedData.setData({ kkr: kkr });
      var data = syncedData.getData();

      var sentString = syncedData._bus.emit.args[0][1];
      var sentJSON = JSON.parse(sentString);
      (0, _chai.expect)(sentJSON).to.deep.equal(data);
      syncedData._bus.emit = originalEmit;
    });

    it('should update existing data', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var kkr = _uuid2.default.v4();
      var originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = _sinon2.default.stub();

      var previousKKR = syncedData.getData().kkr;
      syncedData.setData({ kkr: kkr });
      var data = syncedData.getData();

      (0, _chai.expect)(data.kkr).not.to.be.equal(previousKKR);
      syncedData._bus.emit = originalEmit;
    });

    it('should run all handlers with the data', function (done) {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var kkr = _uuid2.default.v4();
      var stop = syncedData.watchData(function (data) {
        stop();
        (0, _chai.expect)(data.kkr).to.be.equal(kkr);
        done();
      });

      var originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = _sinon2.default.stub();
      syncedData.setData({ kkr: kkr });
      syncedData._bus.emit = originalEmit;
    });

    it('should add a property with __lastUpdated with Date.now()', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var now = _uuid2.default.v4();
      var originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = _sinon2.default.stub();
      var originalNow = Date.now;
      Date.now = function () {
        return now;
      };

      syncedData.setData({ aa: 10 });
      var data = syncedData.getData();

      (0, _chai.expect)(data.__lastUpdated).to.be.equal(now);
      Date.now = originalNow;
      syncedData._bus.emit = originalEmit;
    });
  });

  describe('receiveData', function () {
    it('should set received data as the new data', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var previousData = syncedData.getData();
      var newData = { kkr: _uuid2.default.v4() };
      syncedData._onData((0, _stringify2.default)(newData));

      var updatedData = syncedData.getData();
      delete updatedData.iframeMode;
      (0, _chai.expect)(updatedData).to.deep.equal(newData);
      (0, _chai.expect)(previousData).not.to.deep.equal(newData);
    });

    it('should run all handlers with data', function (done) {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var newData = { kkr: _uuid2.default.v4() };
      var stop = syncedData.watchData(function (data) {
        stop();
        var updatedData = (0, _extends3.default)({}, data);
        delete updatedData.iframeMode;
        (0, _chai.expect)(updatedData).to.deep.equal(newData);
        done();
      });

      syncedData._onData((0, _stringify2.default)(newData));
    });

    it('should set the local iframeMode to data', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var newData = {
        kkr: _uuid2.default.v4(),
        iframeMode: _uuid2.default.v4()
      };

      var oldIframeMode = syncedData.getData().iframeMode;
      syncedData._onData((0, _stringify2.default)(newData));

      var newIframeMode = syncedData.getData().iframeMode;

      (0, _chai.expect)(newIframeMode).to.be.deep.equal(oldIframeMode);
    });
  });

  describe('getDataKey', function () {
    it('should get the data key prefixed with the current dataId', function () {
      var syncedData = getSyncedData(_uuid2.default.v4());

      var dataId = syncedData.getData().dataId;
      var dataKey = syncedData.getDataKey();
      (0, _chai.expect)(dataKey).to.be.equal('data-' + dataId);
    });
  });
});