"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var console = global.console;
exports.logger = {
    info: function (message) { return console.log(message); },
    warn: function (message) { return console.warn(message); },
    error: function (message) { return console.error(message); },
};
