"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var npmlog_1 = require("npmlog");
var _1 = require(".");
jest.mock('npmlog', function () { return ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}); });
describe('node-logger', function () {
    beforeEach(function () {
        // This feels odd but TypeScript doesn't understand that the imported
        // npmlog module is being wrapped by Jest so we are type casting here
        // in order to be allowed to call Jest's mockReset() method.
        npmlog_1.info.mockReset();
        npmlog_1.warn.mockReset();
        npmlog_1.error.mockReset();
    });
    it('should have an info method', function () {
        var message = 'information';
        _1.logger.info(message);
        expect(npmlog_1.info).toHaveBeenCalledWith('', message);
    });
    it('should have a warn method', function () {
        var message = 'warning message';
        _1.logger.warn(message);
        expect(npmlog_1.warn).toHaveBeenCalledWith('', message);
    });
    it('should have an error method', function () {
        var message = 'error message';
        _1.logger.error(message);
        expect(npmlog_1.error).toHaveBeenCalledWith('', message);
    });
});
