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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
var addons_1 = require("@storybook/addons");
var core_events_1 = require("@storybook/core-events");
var addon_actions_1 = require("@storybook/addon-actions");
var ActionLogger_1 = require("../../components/ActionLogger");
var safeDeepEqual = function (a, b) {
    try {
        return (0, fast_deep_equal_1.default)(a, b);
    }
    catch (e) {
        return false;
    }
};
var ActionLogger = function (_a) {
    var active = _a.active;
    var _b = (0, react_1.useState)([]), actions = _b[0], setActions = _b[1];
    var clearActions = function () { return setActions([]); };
    var clearActionsOnStoryChange = actions.length > 0 && actions[0].options.clearOnStoryChange;
    (0, react_1.useEffect)(function () {
        var handleStoryChange = function () {
            if (clearActionsOnStoryChange) {
                clearActions();
            }
        };
        var channel = addons_1.addons.getChannel();
        channel.addListener(core_events_1.SELECT_STORY, handleStoryChange);
        return function () {
            channel.removeListener(core_events_1.SELECT_STORY, handleStoryChange);
        };
    }, [clearActionsOnStoryChange]);
    (0, react_1.useEffect)(function () {
        var addAction = function (action) {
            setActions(function (prevState) {
                var newActions = __spreadArray([], prevState, true);
                var previous = newActions.length && newActions[0];
                if (previous && safeDeepEqual(previous.data, action.data)) {
                    previous.count++;
                }
                else {
                    action.count = 1;
                    newActions.unshift(action);
                }
                return newActions.slice(0, action.options.limit);
            });
        };
        var channel = addons_1.addons.getChannel();
        channel.addListener(addon_actions_1.EVENT_ID, addAction);
        return function () {
            channel.removeListener(addon_actions_1.EVENT_ID, addAction);
        };
    }, []);
    return active ? react_1.default.createElement(ActionLogger_1.ActionLogger, { actions: actions, onClear: clearActions }) : null;
};
exports.default = ActionLogger;
