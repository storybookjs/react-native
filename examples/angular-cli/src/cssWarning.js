"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("global");
function addCssWarning() {
    var warning = global_1.document.createElement('h1');
    warning.textContent = 'CSS rules are not configured as needed';
    warning.className = 'css-rules-warning';
    warning.style.color = 'red';
    global_1.document.body.insertBefore(warning, global_1.document.body.firstChild);
}
exports.default = addCssWarning;
