"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyCodeStrMap = /** @class */ (function () {
    function KeyCodeStrMap() {
        this._keyCodetoStr = [];
        this._strToKeyCode = Object.create(null);
    }
    KeyCodeStrMap.prototype.define = function (keyCode, str) {
        this._keyCodetoStr[keyCode] = str;
        this._strToKeyCode[str.toLowerCase()] = keyCode;
    };
    KeyCodeStrMap.prototype.keyCodeToStr = function (keyCode) {
        return this._keyCodetoStr[keyCode];
    };
    KeyCodeStrMap.prototype.strToKeyCode = function (str) {
        return this._strToKeyCode[str.toLowerCase()] || 0 /* Unknown */;
    };
    return KeyCodeStrMap;
}());
var uiMap = new KeyCodeStrMap();
var userSettingsUSMap = new KeyCodeStrMap();
var userSettingsGeneralMap = new KeyCodeStrMap();
(function () {
    function define(keyCode, uiLabel, usUserSettingsLabel, generalUserSettingsLabel) {
        if (usUserSettingsLabel === void 0) { usUserSettingsLabel = uiLabel; }
        if (generalUserSettingsLabel === void 0) { generalUserSettingsLabel = usUserSettingsLabel; }
        uiMap.define(keyCode, uiLabel);
        userSettingsUSMap.define(keyCode, usUserSettingsLabel);
        userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel);
    }
    define(0 /* Unknown */, 'unknown');
    define(1 /* Backspace */, 'Backspace');
    define(2 /* Tab */, 'Tab');
    define(3 /* Enter */, 'Enter');
    define(4 /* Shift */, 'Shift');
    define(5 /* Ctrl */, 'Ctrl');
    define(6 /* Alt */, 'Alt');
    define(7 /* PauseBreak */, 'PauseBreak');
    define(7 /* CapsLock */, 'CapsLock');
    define(9 /* Escape */, 'Escape');
    define(10 /* Space */, 'Space');
    define(11 /* PageUp */, 'PageUp');
    define(12 /* PageDown */, 'PageDown');
    define(13 /* End */, 'End');
    define(14 /* Home */, 'Home');
    define(15 /* LeftArrow */, 'LeftArrow');
    define(16 /* UpArrow */, 'UpArrow');
    define(17 /* RightArrow */, 'RightArrow');
    define(18 /* DownArrow */, 'DownArrow');
    define(19 /* Insert */, 'Insert');
    define(20 /* Delete */, 'Delete');
    define(21 /* KEY_0 */, 'KEY_0');
    define(22 /* KEY_1 */, 'KEY_1');
    define(23 /* KEY_2 */, 'KEY_2');
    define(24 /* KEY_3 */, 'KEY_3');
    define(25 /* KEY_4 */, 'KEY_4');
    define(26 /* KEY_5 */, 'KEY_5');
    define(27 /* KEY_6 */, 'KEY_6');
    define(28 /* KEY_7 */, 'KEY_7');
    define(29 /* KEY_8 */, 'KEY_8');
    define(30 /* KEY_9 */, 'KEY_9');
    define(31 /* KEY_A */, 'KEY_A');
    define(32 /* KEY_B */, 'KEY_B');
    define(33 /* KEY_C */, 'KEY_C');
    define(34 /* KEY_D */, 'KEY_D');
    define(35 /* KEY_E */, 'KEY_E');
    define(36 /* KEY_F */, 'KEY_F');
    define(37 /* KEY_G */, 'KEY_G');
    define(38 /* KEY_H */, 'KEY_H');
    define(39 /* KEY_I */, 'KEY_I');
    define(40 /* KEY_J */, 'KEY_J');
    define(41 /* KEY_K */, 'KEY_K');
    define(42 /* KEY_L */, 'KEY_L');
    define(43 /* KEY_M */, 'KEY_M');
    define(44 /* KEY_N */, 'KEY_N');
    define(45 /* KEY_O */, 'KEY_O');
    define(46 /* KEY_P */, 'KEY_P');
    define(47 /* KEY_Q */, 'KEY_Q');
    define(48 /* KEY_R */, 'KEY_R');
    define(49 /* KEY_S */, 'KEY_S');
    define(50 /* KEY_T */, 'KEY_T');
    define(51 /* KEY_U */, 'KEY_U');
    define(52 /* KEY_V */, 'KEY_V');
    define(53 /* KEY_W */, 'KEY_W');
    define(54 /* KEY_X */, 'KEY_X');
    define(55 /* KEY_Y */, 'KEY_Y');
    define(56 /* KEY_Z */, 'KEY_Z');
    define(57 /* Meta */, 'Meta');
    define(58 /* ContextMenu */, 'ContextMenu');
    define(59 /* F1 */, 'F1');
    define(60 /* F2 */, 'F2');
    define(61 /* F3 */, 'F3');
    define(62 /* F4 */, 'F4');
    define(63 /* F5 */, 'F5');
    define(64 /* F6 */, 'F6');
    define(65 /* F7 */, 'F7');
    define(66 /* F8 */, 'F8');
    define(67 /* F9 */, 'F9');
    define(68 /* F10 */, 'F10');
    define(69 /* F11 */, 'F11');
    define(70 /* F12 */, 'F12');
    define(71 /* F13 */, 'F13');
    define(72 /* F14 */, 'F14');
    define(73 /* F15 */, 'F15');
    define(74 /* F16 */, 'F16');
    define(75 /* F17 */, 'F17');
    define(76 /* F18 */, 'F18');
    define(77 /* F19 */, 'F19');
    define(78 /* NumLock */, 'NumLock');
    define(79 /* ScrollLock */, 'ScrollLock');
    define(80 /* US_SEMICOLON */, ';', ';', 'OEM_1');
    define(81 /* US_EQUAL */, '=', '=', 'OEM_PLUS');
    define(82 /* US_COMMA */, ',', ',', 'OEM_COMMA');
    define(83 /* US_MINUS */, '-', '-', 'OEM_MINUS');
    define(84 /* US_DOT */, '.', '.', 'OEM_PERIOD');
    define(85 /* US_SLASH */, '/', '/', 'OEM_2');
    define(86 /* US_BACKTICK */, '`', '`', 'OEM_3');
    define(110 /* ABNT_C1 */, 'ABNT_C1');
    define(111 /* ABNT_C2 */, 'ABNT_C2');
    define(87 /* US_OPEN_SQUARE_BRACKET */, '[', '[', 'OEM_4');
    define(88 /* US_BACKSLASH */, '\\', '\\', 'OEM_5');
    define(89 /* US_CLOSE_SQUARE_BRACKET */, ']', ']', 'OEM_6');
    define(90 /* US_QUOTE */, "'", "'", 'OEM_7');
    define(91 /* OEM_8 */, 'OEM_8');
    define(92 /* OEM_102 */, 'OEM_102');
    define(93 /* NUMPAD_0 */, 'NumPad0');
    define(94 /* NUMPAD_1 */, 'NumPad1');
    define(95 /* NUMPAD_2 */, 'NumPad2');
    define(96 /* NUMPAD_3 */, 'NumPad3');
    define(97 /* NUMPAD_4 */, 'NumPad4');
    define(98 /* NUMPAD_5 */, 'NumPad5');
    define(99 /* NUMPAD_6 */, 'NumPad6');
    define(100 /* NUMPAD_7 */, 'NumPad7');
    define(101 /* NUMPAD_8 */, 'NumPad8');
    define(102 /* NUMPAD_9 */, 'NumPad9');
    define(103 /* NUMPAD_MULTIPLY */, 'NumPad_Multiply');
    define(104 /* NUMPAD_ADD */, 'NumPad_Add');
    define(105 /* NUMPAD_SEPARATOR */, 'NumPad_Separator');
    define(106 /* NUMPAD_SUBTRACT */, 'NumPad_Subtract');
    define(107 /* NUMPAD_DECIMAL */, 'NumPad_Decimal');
    define(108 /* NUMPAD_DIVIDE */, 'NumPad_Divide');
})();
var KeyCodeUtils;
(function (KeyCodeUtils) {
    function toString(keyCode) {
        return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toString = toString;
    function fromString(key) {
        return uiMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromString = fromString;
})(KeyCodeUtils = exports.KeyCodeUtils || (exports.KeyCodeUtils = {}));
function KeyChord(firstPart, secondPart) {
    var chordPart = ((secondPart & 0x0000ffff) << 16) >>> 0;
    return (firstPart | chordPart) >>> 0;
}
exports.KeyChord = KeyChord;
function createKeyBinding(keybinding, OS) {
    if (keybinding === 0)
        return null;
    var firstPart = (keybinding & 0x0000ffff) >>> 0;
    var chordPart = (keybinding & 0xffff0000) >>> 16;
    if (chordPart !== 0) {
        return new ChordKeybinding(createSimpleKeybinding(firstPart, OS), createSimpleKeybinding(chordPart, OS));
    }
    return createSimpleKeybinding(firstPart, OS);
}
exports.createKeyBinding = createKeyBinding;
function createSimpleKeybinding(keybinding, OS) {
    var ctrlCmd = keybinding & 2048 /* CtrlCmd */ ? true : false;
    var winCtrl = keybinding & 256 /* WinCtrl */ ? true : false;
    var ctrlKey = OS === 2 /* Macintosh */ ? winCtrl : ctrlCmd;
    var shiftKey = keybinding & 1024 /* Shift */ ? true : false;
    var altKey = keybinding & 512 /* Alt */ ? true : false;
    var metaKey = OS === 2 /* Macintosh */ ? ctrlCmd : winCtrl;
    var keyCode = keybinding & 255 /* KeyCode */;
    return new SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode);
}
exports.createSimpleKeybinding = createSimpleKeybinding;
var SimpleKeybinding = /** @class */ (function () {
    function SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode) {
        this.type = 1 /* Simple */;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
        this.metaKey = metaKey;
        this.keyCode = keyCode;
    }
    SimpleKeybinding.prototype.equals = function (other) {
        if (other.type !== 1 /* Simple */)
            return false;
        return (this.ctrlKey === other.ctrlKey &&
            this.shiftKey === other.shiftKey &&
            this.altKey === other.altKey &&
            this.metaKey === other.metaKey &&
            this.keyCode === other.keyCode);
    };
    SimpleKeybinding.prototype.getHashCode = function () {
        var ctrl = this.ctrlKey ? '1' : '0';
        var shift = this.shiftKey ? '1' : '0';
        var alt = this.altKey ? '1' : '0';
        var meta = this.metaKey ? '1' : '0';
        return "" + ctrl + shift + alt + meta + this.keyCode;
    };
    SimpleKeybinding.prototype.isModifierKey = function () {
        return (this.keyCode === 0 /* Unknown */ ||
            this.keyCode === 5 /* Ctrl */ ||
            this.keyCode === 57 /* Meta */ ||
            this.keyCode === 6 /* Alt */ ||
            this.keyCode === 4 /* Shift */);
    };
    SimpleKeybinding.prototype.isDupliateModifierCase = function () {
        return ((this.ctrlKey && this.keyCode === 5 /* Ctrl */) ||
            (this.shiftKey && this.keyCode === 4 /* Shift */) ||
            (this.altKey && this.keyCode === 6 /* Alt */) ||
            (this.metaKey && this.keyCode === 57 /* Meta */));
    };
    return SimpleKeybinding;
}());
exports.SimpleKeybinding = SimpleKeybinding;
var ChordKeybinding = /** @class */ (function () {
    function ChordKeybinding(firstPart, chordPart) {
        this.type = 2 /* Chord */;
        this.firstPart = firstPart;
        this.chordPart = chordPart;
    }
    ChordKeybinding.prototype.getHashCode = function () {
        return this.firstPart.getHashCode() + ";" + this.chordPart.getHashCode();
    };
    return ChordKeybinding;
}());
exports.ChordKeybinding = ChordKeybinding;
var ResolveKeybindingPart = /** @class */ (function () {
    function ResolveKeybindingPart(ctrlKey, shiftKey, altKey, metaKey, kbLabel, kbAriaLabel) {
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
        this.metaKey = metaKey;
        this.keyLabel = kbLabel;
        this.keyAriaLabel = kbAriaLabel;
    }
    return ResolveKeybindingPart;
}());
exports.ResolveKeybindingPart = ResolveKeybindingPart;
var ResolvedKeybinding = /** @class */ (function () {
    function ResolvedKeybinding() {
    }
    return ResolvedKeybinding;
}());
exports.ResolvedKeybinding = ResolvedKeybinding;
