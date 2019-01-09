"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var npmlog_1 = __importDefault(require("npmlog"));
var pretty_hrtime_1 = __importDefault(require("pretty-hrtime"));
var chalk_1 = __importDefault(require("chalk"));
exports.colors = {
    pink: chalk_1.default.hex('F1618C'),
    purple: chalk_1.default.hex('B57EE5'),
    orange: chalk_1.default.hex('F3AD38'),
    green: chalk_1.default.hex('A2E05E'),
    blue: chalk_1.default.hex('6DABF5'),
    red: chalk_1.default.hex('F16161'),
    gray: chalk_1.default.gray,
};
exports.logger = {
    info: function (message) { return npmlog_1.default.info('', message); },
    warn: function (message) { return npmlog_1.default.warn('', message); },
    error: function (message) { return npmlog_1.default.error('', message); },
    trace: function (_a) {
        var message = _a.message, time = _a.time;
        return npmlog_1.default.info('', message + " (" + exports.colors.purple(pretty_hrtime_1.default(time)) + ")");
    },
};
