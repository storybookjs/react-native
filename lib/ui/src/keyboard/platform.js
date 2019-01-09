"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("global");
var _isWindows = false;
var _isMacintosh = false;
var _isLinux = false;
var _locale = undefined;
var _language = undefined;
exports.isWindows = _isWindows;
exports.isMacintosh = _isMacintosh;
exports.isLinux = _isLinux;
if (typeof global_1.navigator === 'object') {
    var userAgent = global_1.navigator.userAgent;
    _isWindows = userAgent.indexOf('Windows') >= 0;
    _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
    _isLinux = userAgent.indexOf('Linux') >= 0;
    _locale = global_1.navigator.language;
    _language = _locale;
}
exports.OS = _isMacintosh
    ? 2 /* Macintosh */
    : _isWindows
        ? 1 /* Windows */
        : 3 /* Linux */;
