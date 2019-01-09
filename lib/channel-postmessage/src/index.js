"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("global");
var channels_1 = __importDefault(require("@storybook/channels"));
var telejson_1 = require("telejson");
exports.KEY = 'storybook-channel';
// TODO: we should export a method for opening child windows here and keep track of em.
// that way we can send postMessage to child windows as well, not just iframe
// https://stackoverflow.com/questions/6340160/how-to-get-the-references-of-all-already-opened-child-windows
var PostmsgTransport = /** @class */ (function () {
    function PostmsgTransport(config) {
        var _this = this;
        this.config = config;
        this.buffer = [];
        this.handler = null;
        global_1.window.addEventListener('message', this.handleEvent.bind(this), false);
        global_1.document.addEventListener('DOMContentLoaded', function () { return _this.flush(); });
        // Check whether the config.page parameter has a valid value
        if (config.page !== 'manager' && config.page !== 'preview') {
            throw new Error("postmsg-channel: \"config.page\" cannot be \"" + config.page + "\"");
        }
    }
    PostmsgTransport.prototype.setHandler = function (handler) {
        this.handler = handler;
    };
    /**
     * Sends `event` to the associated window. If the window does not yet exist
     * the event will be stored in a buffer and sent when the window exists.
     * @param event
     */
    PostmsgTransport.prototype.send = function (event) {
        var _this = this;
        var iframeWindow = this.getWindow();
        if (!iframeWindow) {
            return new Promise(function (resolve, reject) {
                _this.buffer.push({ event: event, resolve: resolve, reject: reject });
            });
        }
        var data = telejson_1.stringify({ key: exports.KEY, event: event }, { maxDepth: 10 });
        // TODO: investigate http://blog.teamtreehouse.com/cross-domain-messaging-with-postmessage
        // might replace '*' with document.location ?
        iframeWindow.postMessage(data, '*');
        return Promise.resolve(null);
    };
    PostmsgTransport.prototype.flush = function () {
        var _this = this;
        var buffer = this.buffer;
        this.buffer = [];
        buffer.forEach(function (item) {
            _this.send(item.event)
                .then(item.resolve)
                .catch(item.reject);
        });
    };
    PostmsgTransport.prototype.getWindow = function () {
        if (this.config.page === 'manager') {
            // FIXME this is a really bad idea! use a better way to do this.
            // This finds the storybook preview iframe to send messages to.
            var iframe = global_1.document.getElementById('storybook-preview-iframe');
            if (!iframe) {
                return null;
            }
            return iframe.contentWindow;
        }
        return global_1.window.parent;
    };
    PostmsgTransport.prototype.handleEvent = function (rawEvent) {
        try {
            var data = rawEvent.data;
            var _a = typeof data === 'string' && telejson_1.isJSON(data) ? telejson_1.parse(data) : data, key = _a.key, event_1 = _a.event;
            if (key === exports.KEY) {
                // tslint:disable-next-line no-console
                console.debug.apply(console, ["message arrived at " + this.config.page, event_1.type].concat(event_1.args));
                this.handler(event_1);
            }
        }
        catch (error) {
            // tslint:disable-next-line no-console
            console.error(error);
            // tslint:disable-next-line no-debugger
            debugger;
        }
    };
    return PostmsgTransport;
}());
exports.PostmsgTransport = PostmsgTransport;
/**
 * Creates a channel which communicates with an iframe or child window.
 */
function createChannel(_a) {
    var page = _a.page;
    var transport = new PostmsgTransport({ page: page });
    return new channels_1.default({ transport: transport });
}
exports.default = createChannel;
