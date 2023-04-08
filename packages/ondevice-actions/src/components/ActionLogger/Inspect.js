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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme = {
    OBJECT_NAME_COLOR: 'rgb(136, 19, 145)',
    OBJECT_VALUE_NULL_COLOR: 'rgb(128, 128, 128)',
    OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(128, 128, 128)',
    OBJECT_VALUE_REGEXP_COLOR: 'rgb(196, 26, 22)',
    OBJECT_VALUE_STRING_COLOR: 'rgb(196, 26, 22)',
    OBJECT_VALUE_SYMBOL_COLOR: 'rgb(196, 26, 22)',
    OBJECT_VALUE_NUMBER_COLOR: 'rgb(28, 0, 207)',
    OBJECT_VALUE_BOOLEAN_COLOR: 'rgb(28, 0, 207)',
    OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(13, 34, 170)',
    ARROW_COLOR: '#859499',
};
var Inspect = function (_a) {
    var name = _a.name, value = _a.value;
    var _b = (0, react_1.useState)(false), expanded = _b[0], setExpanded = _b[1];
    var canExpand = name &&
        ((Array.isArray(value) && value.length) ||
            (value && typeof value === 'object' && Object.keys(value).length));
    var toggleExpanded = react_1.default.useCallback(function () {
        if (canExpand) {
            setExpanded(function (currentValue) { return !currentValue; });
        }
    }, [canExpand]);
    var toggle = (react_1.default.createElement(react_native_1.Text, { style: { color: canExpand ? theme.ARROW_COLOR : 'transparent', paddingRight: 8 } }, expanded ? '▼' : '▶'));
    var nameComponent = name ? (react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_NAME_COLOR } }, name)) : null;
    if (Array.isArray(value)) {
        if (name) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_native_1.TouchableOpacity, { onPress: toggleExpanded, style: styles.row },
                    toggle,
                    nameComponent,
                    react_1.default.createElement(react_native_1.Text, null, ": ".concat(value.length === 0 ? '[]' : expanded ? '[' : '[...]'))),
                expanded ? (react_1.default.createElement(react_native_1.View, { style: styles.expanded },
                    value.map(function (v, i) { return (react_1.default.createElement(react_native_1.View, { key: i, style: styles.expanded },
                        react_1.default.createElement(Inspect, { value: v }))); }),
                    react_1.default.createElement(react_native_1.View, { style: styles.spacingLeft },
                        react_1.default.createElement(react_native_1.Text, null, "]")))) : null));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_native_1.Text, null, "["),
            value.map(function (v, i) { return (react_1.default.createElement(react_native_1.View, { key: i, style: styles.spacingLeft },
                react_1.default.createElement(Inspect, { value: v }))); }),
            react_1.default.createElement(react_native_1.Text, null, "]")));
    }
    if (value && typeof value === 'object' && !(value instanceof RegExp)) {
        if (name) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_native_1.TouchableOpacity, { style: styles.row, onPress: toggleExpanded },
                    toggle,
                    nameComponent,
                    react_1.default.createElement(react_native_1.Text, null, ": ".concat(Object.keys(value).length === 0 ? '{}' : expanded ? '{' : '{...}'))),
                expanded ? (react_1.default.createElement(react_native_1.View, { style: styles.expanded },
                    Object.entries(value).map(function (_a) {
                        var key = _a[0], v = _a[1];
                        return (react_1.default.createElement(react_native_1.View, { key: key },
                            react_1.default.createElement(Inspect, { name: key, value: v })));
                    }),
                    react_1.default.createElement(react_native_1.View, { style: styles.spacingLeft },
                        react_1.default.createElement(react_native_1.Text, null, '}')))) : null));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_native_1.Text, null, '{'),
            Object.entries(value).map(function (_a) {
                var key = _a[0], v = _a[1];
                return (react_1.default.createElement(react_native_1.View, { key: key },
                    react_1.default.createElement(Inspect, { name: key, value: v })));
            }),
            react_1.default.createElement(react_native_1.Text, null, '}')));
    }
    if (name) {
        return (react_1.default.createElement(react_native_1.View, { style: styles.row },
            toggle,
            nameComponent,
            react_1.default.createElement(react_native_1.Text, null, ": "),
            react_1.default.createElement(Value, { value: value })));
    }
    return react_1.default.createElement(Value, { value: value });
};
function Value(_a) {
    var value = _a.value;
    if (value === null) {
        return react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_NULL_COLOR } }, "null");
    }
    if (value === undefined) {
        return react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_UNDEFINED_COLOR } }, "undefined");
    }
    if (value instanceof RegExp) {
        return (react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_REGEXP_COLOR } }, "/".concat(value.source, "/").concat(value.flags)));
    }
    switch (typeof value) {
        case 'string':
            return (react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_STRING_COLOR } }, JSON.stringify(value)));
        case 'number':
            return (react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_NUMBER_COLOR } }, JSON.stringify(value)));
        case 'boolean':
            return (react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_BOOLEAN_COLOR } }, JSON.stringify(value)));
        case 'function':
            return react_1.default.createElement(react_native_1.Text, { style: { color: theme.OBJECT_VALUE_FUNCTION_PREFIX_COLOR } }, "[Function]");
        default:
            return react_1.default.createElement(react_native_1.Text, null, JSON.stringify(value));
    }
}
exports.default = Inspect;
var styles = react_native_1.StyleSheet.create({
    spacingLeft: { marginLeft: 20 },
    expanded: { marginLeft: 20 },
    row: { paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
});
