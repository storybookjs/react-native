"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PANEL_ID = exports.ADDON_ID = exports.PARAM_KEY = void 0;
exports.PARAM_KEY = 'backgrounds';
exports.ADDON_ID = 'storybook-addon-background';
exports.PANEL_ID = "".concat(exports.ADDON_ID, "/background-panel");
exports.default = {
    SET: "".concat(exports.ADDON_ID, ":set"),
    UNSET: "".concat(exports.ADDON_ID, ":unset"),
    UPDATE_BACKGROUND: "".concat(exports.ADDON_ID, ":update"),
};
