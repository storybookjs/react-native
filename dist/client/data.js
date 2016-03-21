"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

exports.setData = setData;
exports.watchData = watchData;
exports.getData = getData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {};
var handlers = [];

function setData(fields) {
  (0, _keys2.default)(fields).forEach(function (key) {
    data[key] = fields[key];
  });

  handlers.forEach(function (handler) {
    return handler(getData());
  });
};

function watchData(fn) {
  handlers.push(fn);
  return function () {
    var index = handlers.indexOf(fn);
    handlers.splice(index, 1);
  };
}

function getData() {
  return (0, _extends3.default)({}, data);
}