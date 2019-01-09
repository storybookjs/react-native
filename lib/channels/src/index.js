"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generateRandomId = function () {
    // generates a random 13 character string
    return Math.random()
        .toString(16)
        .slice(2);
};
var Channel = /** @class */ (function () {
    function Channel(_a) {
        var _b = _a === void 0 ? {} : _a, transport = _b.transport, _c = _b.async, async = _c === void 0 ? false : _c;
        var _this = this;
        this.sender = generateRandomId();
        this.events = {};
        this.isAsync = async;
        if (transport) {
            this.transport = transport;
            this.transport.setHandler(function (event) { return _this.handleEvent(event); });
        }
    }
    Object.defineProperty(Channel.prototype, "hasTransport", {
        get: function () {
            return !!this.transport;
        },
        enumerable: true,
        configurable: true
    });
    Channel.prototype.addListener = function (eventName, listener) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(listener);
    };
    Channel.prototype.addPeerListener = function (eventName, listener) {
        var peerListener = listener;
        peerListener.ignorePeer = true;
        this.addListener(eventName, peerListener);
    };
    Channel.prototype.emit = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var event = { type: eventName, args: args, from: this.sender };
        var handler = function () {
            if (_this.transport) {
                _this.transport.send(event);
            }
            _this.handleEvent(event, true);
        };
        if (this.isAsync) {
            // todo I'm not sure how to test this
            setImmediate(handler);
        }
        else {
            handler();
        }
    };
    Channel.prototype.eventNames = function () {
        return Object.keys(this.events);
    };
    Channel.prototype.listenerCount = function (eventName) {
        var listeners = this.listeners(eventName);
        return listeners ? listeners.length : 0;
    };
    Channel.prototype.listeners = function (eventName) {
        var listeners = this.events[eventName];
        return listeners ? listeners : undefined;
    };
    Channel.prototype.once = function (eventName, listener) {
        var onceListener = this.onceListener(eventName, listener);
        this.addListener(eventName, onceListener);
    };
    Channel.prototype.removeAllListeners = function (eventName) {
        if (!eventName) {
            this.events = {};
        }
        else if (this.events[eventName]) {
            delete this.events[eventName];
        }
    };
    Channel.prototype.removeListener = function (eventName, listener) {
        var listeners = this.listeners(eventName);
        if (listeners) {
            this.events[eventName] = listeners.filter(function (l) { return l !== listener; });
        }
    };
    Channel.prototype.on = function (eventName, listener) {
        this.addListener(eventName, listener);
    };
    Channel.prototype.handleEvent = function (event, isPeer) {
        if (isPeer === void 0) { isPeer = false; }
        var listeners = this.listeners(event.type);
        if (listeners && (isPeer || event.from !== this.sender)) {
            listeners.forEach(function (fn) { return !(isPeer && fn.ignorePeer) && fn.apply(void 0, event.args); });
        }
    };
    Channel.prototype.onceListener = function (eventName, listener) {
        var _this = this;
        var onceListener = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.removeListener(eventName, onceListener);
            return listener.apply(void 0, args);
        };
        return onceListener;
    };
    return Channel;
}());
exports.Channel = Channel;
exports.default = Channel;
