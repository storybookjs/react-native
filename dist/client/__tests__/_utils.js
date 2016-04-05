"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWindow = setWindow;
function setWindow(search) {
  global.window = {
    location: { search: search },
    addEventListener: function addEventListener() {}
  };
}