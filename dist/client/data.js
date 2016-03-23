'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.setData = setData;
exports.watchData = watchData;
exports.getData = getData;
exports.getDataKey = getDataKey;
exports.getRequestKey = getRequestKey;

var _pageBus = require('page-bus');

var _pageBus2 = _interopRequireDefault(_pageBus);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parsedQs = _queryString2.default.parse(window.location.search);
// We need to check whether we are inside a iframe or not.
// This is used by here and as well as in the UI
var iframeMode = Boolean(parsedQs.dataId);

// We need to create a unique Id for each page. We need to communicate
// using this id as a namespace. Otherwise, each every iframe will get the
// data.
//  We create a new UUID if this is main page. Then, this is used by UI to
//  create queryString param when creating the iframe.
//  If we are in the iframe, we'll get it from the queryString.
var dataId = iframeMode ? parsedQs.dataId : window.dataId;
var data = { iframeMode: iframeMode, dataId: dataId };

var handlers = [];
var bus = (0, _pageBus2.default)();

function setData(fields) {
  (0, _keys2.default)(fields).forEach(function (key) {
    data[key] = fields[key];
  });

  // In page-bus, we must send non-identical data.
  // Otherwise, it'll cache and won't trigger.
  // That's why we are setting the __lastUpdated value here.
  var __lastUpdated = Date.now();
  var newData = (0, _extends3.default)({}, data, { __lastUpdated: __lastUpdated });
  bus.emit(getDataKey(), (0, _stringify2.default)(newData));
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

function getDataKey() {
  return 'data-' + data.dataId;
}

function getRequestKey() {
  return 'data-request-' + data.dataId;
}

bus.on(getDataKey(), function (dataString) {
  var data = JSON.parse(dataString);
  handlers.forEach(function (handler) {
    var newData = (0, _extends3.default)({}, data, { iframeMode: iframeMode });
    handler(newData);
  });
});

// do initial render
handlers.forEach(function (handler) {
  return handler(getData());
});