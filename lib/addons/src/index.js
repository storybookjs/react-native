"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __importDefault(require("global"));
var client_logger_1 = __importDefault(require("@storybook/client-logger"));
var types_1 = require("./types");
exports.types = types_1.types;
exports.isSupportedType = types_1.isSupportedType;
var AddonStore = /** @class */ (function () {
    function AddonStore() {
        var _this = this;
        this.loaders = {};
        this.elements = {};
        this.getChannel = function () {
            // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
            if (!_this.channel) {
                throw new Error('Accessing non-existent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel');
            }
            return _this.channel;
        };
        this.hasChannel = function () { return !!_this.channel; };
        this.setChannel = function (channel) {
            _this.channel = channel;
        };
        this.getElements = function (type) {
            if (!_this.elements[type]) {
                _this.elements[type] = {};
            }
            return _this.elements[type];
        };
        this.addPanel = function (name, options) {
            _this.add(name, __assign({ type: types_1.types.PANEL }, options));
        };
        this.add = function (name, options) {
            var type = options.type;
            var collection = _this.getElements(type);
            collection[name] = __assign({ id: name }, options);
        };
        this.register = function (name, registerCallback) {
            if (_this.loaders[name]) {
                client_logger_1.default.warn(name + " was loaded twice, this could have bad side-effects");
            }
            _this.loaders[name] = registerCallback;
        };
        this.loadAddons = function (api) {
            Object.values(_this.loaders).forEach(function (value) { return value(api); });
        };
    }
    return AddonStore;
}());
exports.AddonStore = AddonStore;
// Enforce addons store to be a singleton
var KEY = '__STORYBOOK_ADDONS';
function getAddonsStore() {
    if (!global_1.default[KEY]) {
        global_1.default[KEY] = new AddonStore();
    }
    return global_1.default[KEY];
}
// Exporting this twice in order to to be able to import it like { addons } instead of 'addons'
// prefer import { addons } from '@storybook/addons' over import addons from '@storybook/addons'
//
// See public_api.ts
exports.addons = getAddonsStore();
