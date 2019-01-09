"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("global");
var json_fn_1 = __importDefault(require("json-fn"));
var channels_1 = require("@storybook/channels");
var WebsocketTransport = /** @class */ (function () {
    function WebsocketTransport(_a) {
        var url = _a.url, onError = _a.onError;
        this.buffer = [];
        this.isReady = false;
        this.connect(url, onError);
    }
    WebsocketTransport.prototype.setHandler = function (handler) {
        this.handler = handler;
    };
    WebsocketTransport.prototype.send = function (event) {
        if (!this.isReady) {
            this.sendLater(event);
        }
        else {
            this.sendNow(event);
        }
    };
    WebsocketTransport.prototype.sendLater = function (event) {
        this.buffer.push(event);
    };
    WebsocketTransport.prototype.sendNow = function (event) {
        var data = json_fn_1.default.stringify(event);
        this.socket.send(data);
    };
    WebsocketTransport.prototype.flush = function () {
        var _this = this;
        var buffer = this.buffer;
        this.buffer = [];
        buffer.forEach(function (event) { return _this.send(event); });
    };
    WebsocketTransport.prototype.connect = function (url, onError) {
        var _this = this;
        this.socket = new global_1.WebSocket(url);
        this.socket.onopen = function () {
            _this.isReady = true;
            _this.flush();
        };
        this.socket.onmessage = function (e) {
            var event = json_fn_1.default.parse(e.data);
            _this.handler(event);
        };
        this.socket.onerror = function (e) {
            if (onError) {
                onError(e);
            }
        };
    };
    return WebsocketTransport;
}());
exports.WebsocketTransport = WebsocketTransport;
function createChannel(_a) {
    var url = _a.url, async = _a.async, onError = _a.onError;
    var transport = new WebsocketTransport({ url: url, onError: onError });
    return new channels_1.Channel({ transport: transport, async: async });
}
exports.default = createChannel;
