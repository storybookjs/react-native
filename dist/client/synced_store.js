'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _pageBus = require('page-bus');

var _pageBus2 = _interopRequireDefault(_pageBus);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Data = function () {
  function Data(window, handleShortCuts) {
    (0, _classCallCheck3.default)(this, Data);

    this._window = window;
    this._handleShortCuts = handleShortCuts;
    this._parsedQs = _queryString2.default.parse(window.location.search);

    // We need to check whether we are inside a iframe or not.
    // This is used by here and as well as in the UI
    this._iframeMode = Boolean(this._parsedQs.dataId);

    // We need to create a unique Id for each page. We need to communicate
    // using this id as a namespace. Otherwise, each every iframe will get the
    // data.
    //  We create a new UUID if this is main page. Then, this is used by UI to
    //  create queryString param when creating the iframe.
    //  If we are in the iframe, we'll get it from the queryString.
    this._dataId = this._iframeMode ? this._parsedQs.dataId : _uuid2.default.v4();
    this._data = {
      iframeMode: this._iframeMode,
      dataId: this._dataId
    };

    this._handlers = [];
  }

  (0, _createClass3.default)(Data, [{
    key: '_onData',
    value: function _onData(dataString) {
      var _this = this;

      var d = JSON.parse(dataString);
      this._data = (0, _extends3.default)({}, d, {
        iframeMode: this._iframeMode
      });

      this._handlers.forEach(function (handler) {
        handler(_this.getData());
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      this._bus = (0, _pageBus2.default)();
      // listen to the bus and apply
      this._bus.on(this.getDataKey(), this._onData.bind(this));
      // do initial render
      this._handlers.forEach(function (handler) {
        return handler(_this2.getData());
      });

      this._window.onkeydown = function (e) {
        return _this2._handleShortCuts(e, _this2.getData());
      };
    }
  }, {
    key: 'getDataKey',
    value: function getDataKey() {
      return 'data-' + this._data.dataId;
    }
  }, {
    key: 'getData',
    value: function getData() {
      return (0, _extends3.default)({}, this._data);
    }
  }, {
    key: 'setData',
    value: function setData(fields) {
      var _this3 = this;

      (0, _keys2.default)(fields).forEach(function (key) {
        _this3._data[key] = fields[key];
      });

      this._data.__lastUpdated = Date.now();
      // In page-bus, we must send non-identical data.
      // Otherwise, it'll cache and won't trigger.
      // That's why we are setting the __lastUpdated value here.
      this._bus.emit(this.getDataKey(), (0, _jsonStringifySafe2.default)(this.getData()));
      this._handlers.forEach(function (handler) {
        return handler(_this3.getData());
      });
    }
  }, {
    key: 'watchData',
    value: function watchData(fn) {
      var _this4 = this;

      this._handlers.push(fn);
      return function () {
        var index = _this4._handlers.indexOf(fn);
        _this4._handlers.splice(index, 1);
      };
    }
  }]);
  return Data;
}();

exports.default = Data;