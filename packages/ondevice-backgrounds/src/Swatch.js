"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var native_1 = __importDefault(require("@emotion/native"));
var prop_types_1 = __importDefault(require("prop-types"));
var react_1 = __importDefault(require("react"));
var PressableSwatch = native_1.default.TouchableOpacity(function (_a) {
    var theme = _a.theme;
    return ({
        marginBottom: theme.tokens.spacing3,
        borderWidth: theme.inputs.swatch.borderWidth,
        borderColor: theme.inputs.swatch.borderColor,
        borderRadius: theme.inputs.swatch.outerBorderRadius,
        backgroundColor: theme.inputs.swatch.backgroundColor,
        paddingVertical: theme.inputs.swatch.paddingVertical,
        paddingHorizontal: theme.inputs.swatch.paddingHorizontal,
    });
});
var ColorSwatch = native_1.default.View(function (_a) {
    var theme = _a.theme, color = _a.color;
    return ({
        height: theme.inputs.swatch.height,
        width: '100%',
        borderRadius: theme.inputs.swatch.innerBorderRadius,
        backgroundColor: color,
    });
});
var ValueContainer = native_1.default.View(function (_a) {
    var theme = _a.theme;
    return ({
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.tokens.spacing1,
        paddingBottom: 0,
    });
});
var NameText = native_1.default.Text(function (_a) {
    var theme = _a.theme;
    return ({
        fontSize: theme.inputs.swatch.fontSize,
        color: theme.inputs.labelTextColor,
        fontWeight: theme.inputs.swatch.nameTextWeight,
    });
});
var ValueText = native_1.default.Text(function (_a) {
    var theme = _a.theme;
    return ({
        fontSize: theme.inputs.swatch.fontSize,
        color: theme.inputs.labelTextColor,
    });
});
var Swatch = function (_a) {
    var name = _a.name, value = _a.value, setBackground = _a.setBackground;
    return (react_1.default.createElement(PressableSwatch, { onPress: function () { return setBackground(value); } },
        react_1.default.createElement(ColorSwatch, { color: value }),
        react_1.default.createElement(ValueContainer, null,
            react_1.default.createElement(NameText, null, name),
            react_1.default.createElement(ValueText, null, value))));
};
Swatch.propTypes = {
    name: prop_types_1.default.string.isRequired,
    value: prop_types_1.default.string.isRequired,
    setBackground: prop_types_1.default.func.isRequired,
};
exports.default = Swatch;
