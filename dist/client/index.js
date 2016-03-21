'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.paper = paper;
exports.getPapers = getPapers;
exports.renderMain = renderMain;

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _data = require('./data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var papers = {};

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

function renderMain(papers) {
  var data = (0, _data.getData)();
  data.error = null;
  data.papers = papers;

  data.selectedPaper = papers[data.selectedPaper] ? data.selectedPaper : (0, _keys2.default)(papers)[0];

  if (data.selectedPaper) {
    var _paper = papers[data.selectedPaper];
    data.selectedBlock = _paper[data.selectedBlock] ? data.selectedBlock : (0, _keys2.default)(_paper)[0];
  }

  (0, _data.setData)(data);
};

var renderError = exports.renderError = function renderError(e) {
  var data = (0, _data.getData)();
  data.error = e;

  (0, _data.setData)(data);
};