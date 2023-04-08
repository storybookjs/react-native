"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
var react_1 = __importDefault(require("react"));
var addons_1 = __importDefault(require("@storybook/addons"));
var addon_actions_1 = require("@storybook/addon-actions");
var ActionLogger_1 = __importDefault(require("./containers/ActionLogger"));
function register() {
    addons_1.default.register(addon_actions_1.ADDON_ID, function () {
        addons_1.default.addPanel(addon_actions_1.PANEL_ID, {
            title: 'Actions',
            render: function (_a) {
                var active = _a.active, key = _a.key;
                return react_1.default.createElement(ActionLogger_1.default, { key: key, active: active });
            },
            paramKey: addon_actions_1.PARAM_KEY,
        });
    });
}
exports.register = register;
