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
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var Swatch_1 = __importDefault(require("./Swatch"));
var constants_1 = __importStar(require("./constants"));
var codeSample = "\nimport React from 'react';\nimport { ComponentStory, ComponentMeta } from '@storybook/react-native';\nimport { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';\nimport { Text, StyleSheet } from 'react-native';\n\nconst Background = () => (\n  <Text style={styles.text}>Change background color via Addons -&gt; Background</Text>\n);\n\nconst styles = StyleSheet.create({\n  text: { color: 'black' },\n});\n\nconst BackgroundMeta: ComponentMeta<typeof Background> = {\n  title: 'Background CSF',\n  component: Background,\n  decorators: [withBackgrounds],\n  parameters: {\n    backgrounds: {\n      default: 'plain',\n      values: [\n        { name: 'plain', value: 'white' },\n        { name: 'warm', value: 'hotpink' },\n        { name: 'cool', value: 'deepskyblue' },\n      ],\n    },\n  },\n};\n\nexport default BackgroundMeta;\n\ntype BackgroundStory = ComponentStory<typeof Background>;\n\nexport const Basic: BackgroundStory = () => <Background />;\n".trim();
var Instructions = function () { return (react_1.default.createElement(react_native_1.View, null,
    react_1.default.createElement(react_native_1.Text, { style: [styles.paragraph, styles.title] }, "Setup Instructions"),
    react_1.default.createElement(react_native_1.Text, { style: styles.paragraph }, "Please add the background decorator definition to your story. The background decorate accepts an array of items, which should include a name for your color (preferably the css class name) and the corresponding color / image value."),
    react_1.default.createElement(react_native_1.Text, { style: styles.paragraph }, "Below is an example of how to add the background decorator to your story definition. Long press the example to copy it."),
    react_1.default.createElement(react_native_1.Text, { selectable: true }, codeSample))); };
var BackgroundPanel = function (_a) {
    var active = _a.active, api = _a.api, channel = _a.channel;
    if (!active) {
        return null;
    }
    var store = api.store();
    var storyId = store.getSelection().storyId;
    var story = store.fromId(storyId);
    var backgrounds = story.parameters[constants_1.PARAM_KEY];
    var setBackgroundFromSwatch = function (background) {
        channel.emit(constants_1.default.UPDATE_BACKGROUND, background);
    };
    return (react_1.default.createElement(react_native_1.View, null, backgrounds ? (backgrounds.values.map(function (_a) {
        var value = _a.value, name = _a.name;
        return (react_1.default.createElement(react_native_1.View, { key: "".concat(name, " ").concat(value) },
            react_1.default.createElement(Swatch_1.default, { value: value, name: name, setBackground: setBackgroundFromSwatch })));
    })) : (react_1.default.createElement(Instructions, null))));
};
exports.default = BackgroundPanel;
var styles = react_native_1.StyleSheet.create({
    title: { fontSize: 16 },
    paragraph: { marginBottom: 8 },
});
