'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.renderMain = renderMain;
exports.getRoot = getRoot;
exports.renderContent = renderContent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redboxReact = require('redbox-react');

var _redboxReact2 = _interopRequireDefault(_redboxReact);

var _controls = require('./ui/controls');

var _controls2 = _interopRequireDefault(_controls);

var _layout = require('./ui/layout');

var _layout2 = _interopRequireDefault(_layout);

var _ud = require('ud');

var ud = _interopRequireWildcard(_ud);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');
var data = ud.defonce(module, function () {
  return {};
});

var Area = function Area(_ref) {
  var main = _ref.main;
  var error = _ref.error;
  return _react2.default.createElement(
    'div',
    { style: {} },
    _react2.default.createElement(
      'div',
      { style: { width: '250px', float: 'left' } },
      _react2.default.createElement(_controls2.default, {
        papers: data.papers,
        selectedPaper: data.selectedPaper,
        selectedBlock: data.selectedBlock,
        onPaper: loadPaper,
        onBlock: loadBlock })
    ),
    _react2.default.createElement(
      'div',
      { style: { marginLeft: '250px' } },
      error ? _react2.default.createElement(_redboxReact2.default, { error: error }) : main
    )
  );
};

function renderArea() {
  if (data.error) {
    var _area = _react2.default.createElement(Area, { error: data.error });
    _reactDom2.default.render(_area, rootEl);
    return;
  }

  var main = _react2.default.createElement(
    'p',
    null,
    'There is no blocks yet!'
  );
  var paper = data.papers[data.selectedPaper];
  if (paper) {
    var block = data.papers[data.selectedPaper][data.selectedBlock];
    if (block) {
      try {
        main = block();
      } catch (ex) {
        data.error = ex;
        renderArea();
        return;
      }
    }
  }

  var area = _react2.default.createElement(Area, { main: main });
  _reactDom2.default.render(area, rootEl);
}

function loadPaper(paper) {
  data.selectedPaper = paper;
  data.selectedBlock = (0, _keys2.default)(data.papers[paper])[0];
  renderArea();
}

function loadBlock(block) {
  data.selectedBlock = block;
  renderArea();
}

function renderMain(papers) {
  data.error = null;
  data.papers = papers;

  data.selectedPaper = papers[data.selectedPaper] ? data.selectedPaper : (0, _keys2.default)(papers)[0];

  if (data.selectedPaper) {
    var paper = papers[data.selectedPaper];
    data.selectedBlock = paper[data.selectedBlock] ? data.selectedBlock : (0, _keys2.default)(paper)[0];
  }

  renderArea();
};

var renderError = exports.renderError = function renderError(e) {
  data.error = e;
  renderArea();
};

function getRoot() {
  return rootEl;
}

function renderContent(comp) {
  _reactDom2.default.render(comp, rootEl);
}