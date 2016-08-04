'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebsocketTransport = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createChannel;

var _storybookChannel = require('@kadira/storybook-channel');

var _storybookChannel2 = _interopRequireDefault(_storybookChannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createChannel(_ref) {
  var url = _ref.url;

  var transport = new WebsocketTransport({ url: url });
  return new _storybookChannel2.default({ transport: transport });
}

var WebsocketTransport = exports.WebsocketTransport = function () {
  function WebsocketTransport(_ref2) {
    var url = _ref2.url;

    _classCallCheck(this, WebsocketTransport);

    this._socket = null;
    this._buffer = [];
    this._handler = null;
    this._isReady = false;
    this._connect(url);
  }

  _createClass(WebsocketTransport, [{
    key: 'setHandler',
    value: function setHandler(handler) {
      this._handler = handler;
    }
  }, {
    key: 'send',
    value: function send(event) {
      if (!this._isReady) {
        this._sendLater(event);
      } else {
        this._sendNow(event);
      }
    }
  }, {
    key: '_sendLater',
    value: function _sendLater(event) {
      this._buffer.push(event);
    }
  }, {
    key: '_sendNow',
    value: function _sendNow(event) {
      var data = JSON.stringify(event);
      this._socket.send(data);
    }
  }, {
    key: '_flush',
    value: function _flush() {
      var _this = this;

      var buffer = this._buffer;
      this._buffer = [];
      buffer.forEach(function (event) {
        return _this.send(event);
      });
    }
  }, {
    key: '_connect',
    value: function _connect(url) {
      var _this2 = this;

      this._socket = new WebSocket(url);
      this._socket.onopen = function () {
        _this2._isReady = true;
        _this2._flush();
      };
      this._socket.onmessage = function (e) {
        var event = JSON.parse(e.data);
        _this2._handler(event);
      };
      this._socket.onerror = function (e) {
        console.error('websocket: connection error', e.message);
      };
      this._socket.onclose = function (e) {
        console.error('websocket: connection closed', e.code, e.reason);
      };
    }
  }]);

  return WebsocketTransport;
}();