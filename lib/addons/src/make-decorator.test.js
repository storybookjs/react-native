"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_deprecate_1 = __importDefault(require("util-deprecate"));
var make_decorator_1 = require("./make-decorator");
// Copy & paste from internal api: core/client/preview/client_api
exports.defaultDecorateStory = function (getStory, decorators) {
    return decorators.reduce(function (decorated, decorator) { return function (context) {
        return decorator(function () { return decorated(context); }, context);
    }; }, getStory);
};
jest.mock('util-deprecate');
var deprecatedFns = [];
util_deprecate_1.default.mockImplementation(function (fn, warning) {
    var deprecatedFn = jest.fn(fn);
    deprecatedFns.push({
        deprecatedFn: deprecatedFn,
        warning: warning,
    });
    return deprecatedFn;
});
describe('makeDecorator', function () {
    it('returns a decorator that passes parameters on the parameters argument', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({ wrapper: wrapper, name: 'test', parameterName: 'test' });
        var story = jest.fn();
        var decoratedStory = exports.defaultDecorateStory(story, [decorator]);
        var context = { parameters: { test: 'test-val' } };
        decoratedStory(context);
        expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, { parameters: 'test-val' });
    });
    it('passes options added at decoration time', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({ wrapper: wrapper, name: 'test', parameterName: 'test' });
        var story = jest.fn();
        var options = 'test-val';
        var decoratedStory = exports.defaultDecorateStory(story, [decorator(options)]);
        var context = {};
        decoratedStory(context);
        expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, { options: 'test-val' });
    });
    it('passes both options *and* parameters at the same time', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({ wrapper: wrapper, name: 'test', parameterName: 'test' });
        var story = jest.fn();
        var options = 'test-val';
        var decoratedStory = exports.defaultDecorateStory(story, [decorator(options)]);
        var context = { parameters: { test: 'test-val' } };
        decoratedStory(context);
        expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
            options: 'test-val',
            parameters: 'test-val',
        });
    });
    it('passes nothing if neither are supplied', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({ wrapper: wrapper, name: 'test', parameterName: 'test' });
        var story = jest.fn();
        var decoratedStory = exports.defaultDecorateStory(story, [decorator]);
        var context = {};
        decoratedStory(context);
        expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {});
    });
    it('calls the story directly if neither options or parameters are supplied and skipIfNoParametersOrOptions is true', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({
            wrapper: wrapper,
            name: 'test',
            parameterName: 'test',
            skipIfNoParametersOrOptions: true,
        });
        var story = jest.fn();
        var decoratedStory = exports.defaultDecorateStory(story, [decorator]);
        var context = {};
        decoratedStory(context);
        expect(wrapper).not.toHaveBeenCalled();
        expect(story).toHaveBeenCalled();
    });
    it('calls the story directly if the disable parameter is passed to the decorator', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({
            wrapper: wrapper,
            name: 'test',
            parameterName: 'test',
            skipIfNoParametersOrOptions: true,
        });
        var story = jest.fn();
        var decoratedStory = exports.defaultDecorateStory(story, [decorator]);
        var context = { disable: true };
        decoratedStory(context);
        expect(wrapper).not.toHaveBeenCalled();
        expect(story).toHaveBeenCalled();
    });
    it('passes options added at story time, but with a deprecation warning, if allowed', function () {
        deprecatedFns = [];
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({
            wrapper: wrapper,
            name: 'test',
            parameterName: 'test',
            allowDeprecatedUsage: true,
        });
        var options = 'test-val';
        var story = jest.fn();
        var decoratedStory = decorator(options)(story);
        expect(deprecatedFns).toHaveLength(1);
        expect(deprecatedFns[0].warning).toMatch('addDecorator(test)');
        var context = {};
        decoratedStory(context);
        expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
            options: 'test-val',
        });
        expect(deprecatedFns[0].deprecatedFn).toHaveBeenCalled();
    });
    it('throws if options are added at storytime, if not allowed', function () {
        var wrapper = jest.fn();
        var decorator = make_decorator_1.makeDecorator({
            wrapper: wrapper,
            name: 'test',
            parameterName: 'test',
            allowDeprecatedUsage: false,
        });
        var options = 'test-val';
        var story = jest.fn();
        expect(function () { return decorator(options)(story); }).toThrow(/not allowed/);
    });
});
