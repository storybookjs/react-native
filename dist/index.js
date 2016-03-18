'use strict';

import _Object$defineProperty from 'babel-runtime/core-js/object/define-property';
import _Object$keys from 'babel-runtime/core-js/object/keys';
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _load = require('./load');

_Object$keys(_load).forEach(function (key) {
  if (key === "default") return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _load[key];
    }
  });
});

exports.paper = paper;
exports.getPapers = getPapers;

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