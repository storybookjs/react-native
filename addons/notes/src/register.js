"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var addons_1 = __importStar(require("@storybook/addons"));
var shared_1 = require("./shared");
// TODO: fix eslint in tslint (igor said he fixed it, should ask him)
var Panel_1 = __importDefault(require("./Panel"));
addons_1.default.register(shared_1.ADDON_ID, function (api) {
    var channel = addons_1.default.getChannel();
    var render = function (_a) {
        var active = _a.active;
        return React.createElement(Panel_1.default, { api: api, active: active });
    };
    var title = 'Notes';
    addons_1.default.add(shared_1.PANEL_ID, {
        type: addons_1.types.TAB,
        title: title,
        route: function (_a) {
            var storyId = _a.storyId;
            return "/info/" + storyId;
        },
        match: function (_a) {
            var viewMode = _a.viewMode;
            return viewMode === 'info';
        },
        render: render,
    });
});
