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
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var constants_1 = __importDefault(require("./constants"));
var Container = function (_a) {
    var initialBackground = _a.initialBackground, channel = _a.channel, children = _a.children;
    var _b = (0, react_1.useState)(initialBackground || ''), background = _b[0], setBackground = _b[1];
    (0, react_1.useEffect)(function () {
        channel.on(constants_1.default.UPDATE_BACKGROUND, setBackground);
        return function () {
            channel.removeListener(constants_1.default.UPDATE_BACKGROUND, setBackground);
        };
    }, [channel]);
    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, background && { backgroundColor: background }] }, children));
};
exports.default = Container;
var styles = react_native_1.StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
});
