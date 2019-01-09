"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var addons_1 = require("@storybook/addons");
var util_deprecate_1 = __importDefault(require("util-deprecate"));
// todo resolve any after @storybook/addons and @storybook/channels are migrated to TypeScript
exports.withNotes = addons_1.makeDecorator({
    name: 'withNotes',
    parameterName: 'notes',
    skipIfNoParametersOrOptions: true,
    allowDeprecatedUsage: true,
    wrapper: util_deprecate_1.default(function (getStory, context, _a) {
        var options = _a.options, parameters = _a.parameters;
        var storyOptions = parameters || options;
        var _b = typeof storyOptions === 'string'
            ? {
                text: storyOptions,
                markdown: undefined,
            }
            : storyOptions, text = _b.text, markdown = _b.markdown;
        if (!text && !markdown) {
            throw new Error("Parameter 'notes' must must be a string or an object with 'text' or 'markdown' properties");
        }
        return getStory(context);
    }, 'withNotes is deprecated'),
});
exports.withMarkdownNotes = util_deprecate_1.default(function (text, options) { }, 'withMarkdownNotes is deprecated');
if (module && module.hot && module.hot.decline) {
    module.hot.decline();
}
