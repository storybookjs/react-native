"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withBackgrounds = void 0;
var React = __importStar(require("react"));
var addons_1 = __importStar(require("@storybook/addons"));
var constants_1 = __importDefault(require("./constants"));
var container_1 = __importDefault(require("./container"));
exports.withBackgrounds = (0, addons_1.makeDecorator)({
    name: 'withBackgrounds',
    parameterName: 'backgrounds',
    skipIfNoParametersOrOptions: true,
    wrapper: function (getStory, context, _a) {
        var options = _a.options, parameters = _a.parameters;
        var data = (parameters || options || { values: [] });
        var backgrounds = data.values;
        var background = 'transparent';
        if (backgrounds.length !== 0) {
            addons_1.default.getChannel().emit(constants_1.default.SET, backgrounds);
            var defaultValue = data.default
                ? backgrounds.find(function (b) { return b.name === data.default; })
                : undefined;
            var defaultOrFirst = defaultValue ? defaultValue : backgrounds[0];
            if (defaultOrFirst) {
                background = defaultOrFirst.value;
            }
        }
        return (React.createElement(container_1.default, { initialBackground: background, channel: addons_1.default.getChannel() }, getStory(context)));
    },
});
