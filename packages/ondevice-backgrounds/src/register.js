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
var React = __importStar(require("react"));
var addons_1 = __importDefault(require("@storybook/addons"));
var constants_1 = require("./constants");
var BackgroundPanel_1 = __importDefault(require("./BackgroundPanel"));
addons_1.default.register(constants_1.ADDON_ID, function (api) {
    var channel = addons_1.default.getChannel();
    addons_1.default.addPanel(constants_1.PANEL_ID, {
        title: 'Backgrounds',
        render: function (_a) {
            var active = _a.active;
            return React.createElement(BackgroundPanel_1.default, { channel: channel, api: api, active: active });
        },
        paramKey: constants_1.PARAM_KEY,
    });
});
