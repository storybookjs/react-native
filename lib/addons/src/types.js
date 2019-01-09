"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types;
(function (types) {
    types["TAB"] = "tab";
    types["PANEL"] = "panel";
    types["TOOL"] = "tool";
})(types = exports.types || (exports.types = {}));
function isSupportedType(type) {
    return !!Object.values(types).find(function (typeVal) { return typeVal === type; });
}
exports.isSupportedType = isSupportedType;
