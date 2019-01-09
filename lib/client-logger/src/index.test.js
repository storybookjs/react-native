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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
describe('client-logger', function () {
    var initialConsole = __assign({}, global.console);
    beforeEach(function () {
        global.console.log = jest.fn();
        global.console.warn = jest.fn();
        global.console.error = jest.fn();
    });
    afterAll(function () {
        global.console = initialConsole;
    });
    it('should have an info method that displays the message', function () {
        var message = 'information';
        _1.logger.info(message);
        expect(global.console.info).toHaveBeenCalledWith(message);
    });
    it('should have an log method that displays the message', function () {
        var message = 'information';
        _1.logger.log(message);
        expect(global.console.log).toHaveBeenCalledWith(message);
    });
    it('should have a warning method that displays the message in yellow, with a trace', function () {
        var message = 'warning message';
        _1.logger.warn(message);
        expect(global.console.warn).toHaveBeenCalledWith(message);
    });
    it('should have an error method that displays the message in red, with a trace', function () {
        var message = 'error message';
        _1.logger.error(message);
        expect(global.console.error).toHaveBeenCalledWith(message);
    });
});
