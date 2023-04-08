"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionLogger = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var Inspect_1 = __importDefault(require("./Inspect"));
var ActionLogger = function (_a) {
    var actions = _a.actions, onClear = _a.onClear;
    return (react_1.default.createElement(react_native_1.ScrollView, null,
        react_1.default.createElement(react_native_1.ScrollView, { horizontal: true },
            react_1.default.createElement(react_native_1.View, null, actions.map(function (action) { return (react_1.default.createElement(react_native_1.View, { key: action.id, style: styles.row },
                react_1.default.createElement(react_native_1.View, null, action.count > 1 ? react_1.default.createElement(react_native_1.Text, null, action.count) : null),
                react_1.default.createElement(react_native_1.View, { style: styles.grow },
                    react_1.default.createElement(Inspect_1.default, { name: action.data.name, value: action.data.args || action.data })))); }))),
        react_1.default.createElement(react_native_1.View, null,
            react_1.default.createElement(react_native_1.Button, { onPress: onClear, title: "CLEAR" }))));
};
exports.ActionLogger = ActionLogger;
exports.default = exports.ActionLogger;
var styles = react_native_1.StyleSheet.create({
    grow: { flexGrow: 1 },
    row: { flexDirection: 'row' },
});
