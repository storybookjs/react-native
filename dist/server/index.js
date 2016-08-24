'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server = function () {
  function Server(options) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Server);

    this.options = options;
    this.httpServer = _http2.default.createServer();
    this.expressApp = (0, _express2.default)();
    this.expressApp.use((0, _middleware2.default)(options.configDir));
    this.httpServer.on('request', this.expressApp);
    this.wsServer = _ws2.default.Server({ server: this.httpServer });
    this.wsServer.on('connection', function (s) {
      return _this.handleWS(s);
    });
  }

  (0, _createClass3.default)(Server, [{
    key: 'handleWS',
    value: function handleWS(socket) {
      var _this2 = this;

      socket.on('message', function (data) {
        _this2.wsServer.clients.forEach(function (c) {
          return c.send(data);
        });
      });
    }
  }, {
    key: 'listen',
    value: function listen() {
      var _httpServer;

      (_httpServer = this.httpServer).listen.apply(_httpServer, arguments);
    }
  }]);
  return Server;
}();

exports.default = Server;