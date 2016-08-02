'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _pageBus = require('page-bus');

var _pageBus2 = _interopRequireDefault(_pageBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Channel = function () {
  function Channel(dataId) {
    (0, _classCallCheck3.default)(this, Channel);

    this._dataId = dataId || _uuid2.default.v4();
    this._pageBus = (0, _pageBus2.default)();
    this._listeners = {};
  }

  (0, _createClass3.default)(Channel, [{
    key: 'getDataId',
    value: function getDataId() {
      return this._dataId;
    }
  }, {
    key: 'on',
    value: function on(type, handler) {
      var listener = function listener(p) {
        return handler(JSON.parse(p));
      };
      // TODO add listener to a map[handler]listener
      this._pageBus.on(this._dataId + '.' + type, listener);
    }
  }, {
    key: 'emit',
    value: function emit(type, data) {
      var payload = (0, _stringify2.default)(data);
      this._pageBus.emit(this._dataId + '.' + type, payload);
    }
  }, {
    key: 'removeListener',
    value: function removeListener() /* type, handler */{
      // TODO get listener from a map[handler]listener
      // this._pageBus.removeListener(type, listener);
    }
  }]);
  return Channel;
}();

exports.default = Channel;