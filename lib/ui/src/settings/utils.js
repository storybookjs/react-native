"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = require("prop-types");
var utils_1 = require("@storybook/components/src/treeview/utils");
var persist_1 = require("./persist");
exports.isShortcutTaken = function (arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
};
exports.parseKey = function (e) {
    var keys = [];
    if (e.altKey) {
        keys.push('alt');
    }
    if (e.ctrlKey) {
        keys.push('control');
    }
    if (e.metaKey) {
        keys.push('meta');
    }
    if (e.key && e.key.length === 1 && e.key !== ' ') {
        keys.push(e.key.toUpperCase());
    }
    if (e.shiftKey) {
        keys.push('shift');
    }
    if (e.key === ' ') {
        keys.push('space');
    }
    if (e.key === 'Escape') {
        keys.push('escape');
    }
    if (e.key === 'ArrowRight') {
        keys.push('ArrowRight');
    }
    if (e.key === 'ArrowDown') {
        keys.push('ArrowDown');
    }
    if (e.key === 'ArrowUp') {
        keys.push('ArrowUp');
    }
    if (e.key === 'ArrowLeft') {
        keys.push('ArrowLeft');
    }
    return keys;
};
exports.keyToSymbol = function (key) {
    if (key === 'alt') {
        return utils_1.optionOrAltSymbol();
    }
    if (key === 'control') {
        return '⌃';
    }
    if (key === 'meta') {
        return '⌘';
    }
    if (key === 'shift') {
        return '⇧​';
    }
    if (key === 'Enter' || key === 'Backspace' || key === 'Esc') {
        return '';
    }
    if (key === 'escape') {
        return '';
    }
    if (key === ' ') {
        return 'SPACE';
    }
    if (key === 'ArrowUp') {
        return '↑';
    }
    if (key === 'ArrowDown') {
        return '↓';
    }
    if (key === 'ArrowLeft') {
        return '←';
    }
    if (key === 'ArrowRight') {
        return '→';
    }
    return key.toUpperCase();
};
exports.labelsArr = [
    'Go full screen',
    'Toggle panel',
    'Toggle panel position',
    'Toggle navigation',
    'Toggle toolbar',
    'Focus search',
    'Focus navigation',
    'Focus iFrame',
    'Focus panel',
    'Previous component',
    'Next component',
    'Previous story',
    'Next story',
    'Go to shortcuts page',
    'Go to about page',
];
exports.defaultShortcutSets = Object.freeze({
    fullScreen: {
        value: ['F'],
        error: false,
    },
    togglePanel: {
        value: ['S'],
        error: false,
    },
    panelPosition: {
        value: ['D'],
        error: false,
    },
    navigation: {
        value: ['A'],
        error: false,
    },
    toolbar: {
        value: ['T'],
        error: false,
    },
    search: {
        value: ['/'],
        error: false,
    },
    focusNav: {
        value: ['1'],
        error: false,
    },
    focusIframe: {
        value: ['2'],
        error: false,
    },
    focusPanel: {
        value: ['3'],
        error: false,
    },
    prevComponent: {
        value: ['alt', 'ArrowUp'],
        error: false,
    },
    nextComponent: {
        value: ['alt', 'ArrowDown'],
        error: false,
    },
    prevStory: {
        value: ['alt', 'ArrowLeft'],
        error: false,
    },
    nextStory: {
        value: ['alt', 'ArrowRight'],
        error: false,
    },
    shortcutsPage: {
        value: ['shift', ',', utils_1.controlOrMetaKey()],
        error: false,
    },
    aboutPage: {
        value: [','],
        error: false,
    },
});
exports.serializableKeyboardShortcuts = {
    fullScreen: ['F'],
    togglePanel: ['S'],
    panelPosition: ['D'],
    navigation: ['A'],
    toolbar: ['T'],
    search: ['/'],
    focusNav: ['1'],
    focusIframe: ['2'],
    focusPanel: ['3'],
    prevComponent: ['alt', 'ArrowUp'],
    nextComponent: ['alt', 'ArrowDown'],
    prevStory: ['alt', 'ArrowLeft'],
    nextStory: ['alt', 'ArrowRight'],
    shortcutsPage: ['shift', ',', utils_1.controlOrMetaKey()],
    aboutPage: [','],
};
exports.shortcutKeyShape = {
    fullScreen: prop_types_1.objectOf(prop_types_1.string).isRequired,
    togglePanel: prop_types_1.objectOf(prop_types_1.string).isRequired,
    panelPosition: prop_types_1.objectOf(prop_types_1.string).isRequired,
    navigation: prop_types_1.objectOf(prop_types_1.string).isRequired,
    toolbar: prop_types_1.objectOf(prop_types_1.string).isRequired,
    search: prop_types_1.objectOf(prop_types_1.string).isRequired,
    focusNav: prop_types_1.objectOf(prop_types_1.string).isRequired,
    focusIframe: prop_types_1.objectOf(prop_types_1.string).isRequired,
    focusPanel: prop_types_1.objectOf(prop_types_1.string).isRequired,
    prevComponent: prop_types_1.objectOf(prop_types_1.string).isRequired,
    nextComponent: prop_types_1.objectOf(prop_types_1.string).isRequired,
    prevStory: prop_types_1.objectOf(prop_types_1.string).isRequired,
    nextStory: prop_types_1.objectOf(prop_types_1.string).isRequired,
    shortcutsPage: prop_types_1.objectOf(prop_types_1.string).isRequired,
    aboutPage: prop_types_1.objectOf(prop_types_1.string).isRequired,
};
exports.serializedLocalStorage = function (obj) {
    return Object.entries(obj).reduce(function (acc, i) {
        var _a;
        return (__assign({}, acc, (_a = {}, _a[i[0]] = { value: i[1].slice(), error: false }, _a)));
    }, []);
};
exports.initShortcutKeys = function () {
    var shortcutKeys = persist_1.get('shortcutKeys');
    if (!shortcutKeys) {
        persist_1.setAll('shortcutKeys', exports.serializableKeyboardShortcuts);
    }
    return shortcutKeys;
};
exports.mapToKeyEl = function (inputValue) {
    if (inputValue && inputValue.length > 0) {
        return inputValue.map(function (k) { return exports.keyToSymbol(k); });
    }
    return undefined;
};
