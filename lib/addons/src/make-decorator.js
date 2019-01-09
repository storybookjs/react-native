"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_deprecate_1 = __importDefault(require("util-deprecate"));
exports.makeDecorator = function (_a) {
    var name = _a.name, parameterName = _a.parameterName, wrapper = _a.wrapper, _b = _a.skipIfNoParametersOrOptions, skipIfNoParametersOrOptions = _b === void 0 ? false : _b, _c = _a.allowDeprecatedUsage, allowDeprecatedUsage = _c === void 0 ? false : _c;
    var decorator = function (options) { return function (getStory, context) {
        var parameters = context.parameters && context.parameters[parameterName];
        if (parameters && parameters.disable) {
            return getStory(context);
        }
        if (skipIfNoParametersOrOptions && !options && !parameters) {
            return getStory(context);
        }
        return wrapper(getStory, context, {
            options: options,
            parameters: parameters,
        });
    }; };
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Used without options as .addDecorator(decorator)
        if (typeof args[0] === 'function') {
            return decorator().apply(void 0, args);
        }
        return function () {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i] = arguments[_i];
            }
            // Used as [.]addDecorator(decorator(options))
            if (innerArgs.length > 1) {
                return decorator.apply(void 0, args).apply(void 0, innerArgs);
            }
            if (allowDeprecatedUsage) {
                // Used to wrap a story directly .add('story', decorator(options)(() => <Story />))
                //   This is now deprecated:
                return util_deprecate_1.default(function (context) { return decorator.apply(void 0, args)(innerArgs[0], context); }, "Passing stories directly into " + name + "() is deprecated,\n          instead use addDecorator(" + name + ") and pass options with the '" + parameterName + "' parameter");
            }
            throw new Error("Passing stories directly into " + name + "() is not allowed,\n        instead use addDecorator(" + name + ") and pass options with the '" + parameterName + "' parameter");
        };
    };
};
