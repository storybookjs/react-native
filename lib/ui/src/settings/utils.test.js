"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __importStar(require("./utils"));
describe('parseKey', function () {
    test('it handles alt key inputs', function () {
        var output = utils.parseKey({ altKey: true });
        expect(output).toEqual(['alt']);
    });
    test('it handles ctrl key inputs', function () {
        var output = utils.parseKey({ ctrlKey: true });
        expect(output).toEqual(['control']);
    });
    test('it handles meta key inputs', function () {
        var output = utils.parseKey({ metaKey: true });
        expect(output).toEqual(['meta']);
    });
    test('it handles enter key inputs', function () {
        var output = utils.parseKey({ key: 'Enter' });
        expect(output).toEqual([]);
    });
    test('it handles space bar inputs', function () {
        var output = utils.parseKey({ key: ' ' });
        expect(output).toEqual(['space']);
    });
    test('it handles escape inputs', function () {
        var output = utils.parseKey({ key: 'Escape' });
        expect(output).toEqual(['escape']);
    });
    test('it handles shift key inputs', function () {
        var output = utils.parseKey({ shiftKey: true });
        expect(output).toEqual(['shift']);
    });
    test('it capitalizes a letter key through', function () {
        var output = utils.parseKey({ key: 'a' });
        expect(output).toEqual(['A']);
    });
    test('it passes regular key through', function () {
        var output = utils.parseKey({ key: '1' });
        expect(output).toEqual(['1']);
    });
});
describe('keyToSymbol', function () {
    test('control returns a caret', function () {
        var result = utils.keyToSymbol('control');
        expect(result).toBe('⌃');
    });
    test('meta returns ⌘', function () {
        var result = utils.keyToSymbol('meta');
        expect(result).toEqual('⌘');
    });
    test('shift returns ⇧', function () {
        var result = utils.keyToSymbol('shift');
        expect(result).toBe('⇧​');
    });
    test('enter returns an empty string', function () {
        var result = utils.keyToSymbol('Enter');
        expect(result).toBe('');
    });
    test("' ' returns SPACE", function () {
        var result = utils.keyToSymbol(' ');
        expect(result).toEqual('SPACE');
    });
    test('escape returns esc', function () {
        var result = utils.keyToSymbol('escape');
        expect(result).toEqual('');
    });
    test('ArrowUp returns ↑​​​', function () {
        var result = utils.keyToSymbol('ArrowUp');
        expect(result).toBe('↑');
    });
    test('ArrowDown returns ↓​​​', function () {
        var result = utils.keyToSymbol('ArrowDown');
        expect(result).toBe('↓');
    });
    test('ArrowLeft returns ←', function () {
        var result = utils.keyToSymbol('ArrowLeft');
        expect(result).toBe('←');
    });
    test('ArrowRight returns →', function () {
        var result = utils.keyToSymbol('ArrowRight');
        expect(result).toBe('→');
    });
    test('it capitalizes a lowercase key', function () {
        var output = utils.keyToSymbol('a');
        expect(output).toBe('A');
    });
});
