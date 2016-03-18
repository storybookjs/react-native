'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = exports.renderMain = undefined;
exports.paper = paper;
exports.getPapers = getPapers;

var _load = require('./load');

var load = _interopRequireWildcard(_load);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var papers = {};
var currentBlocks = [];

function paper(paperName, m) {
  m.hot.dispose(function () {
    delete papers[paperName];
  });
  papers[paperName] = {};
  function block(name, fn) {
    papers[paperName][name] = fn;
    return { block: block };
  }

  return { block: block };
}

function getPapers() {
  return papers;
}

var renderMain = exports.renderMain = load.renderMain;
var renderError = exports.renderError = load.renderError;