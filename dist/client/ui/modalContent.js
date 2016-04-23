'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = modalContent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandStyle = {
  backgroundColor: '#eee',
  padding: '2px 6px',
  borderRadius: 2,
  lineHeight: '36px',
  marginRight: '5px'
};

var h4Style = {
  marginTop: 0,
  textAlign: 'center'
};

function modalContent() {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h4',
      { style: h4Style },
      'Keyboard Shortcuts'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ O'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ O'
      ),
      'Open Searchbox'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ L'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ L'
      ),
      'Toggle SideBar'
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌘ ⇧ B'
      ),
      ' /  ',
      _react2.default.createElement(
        'b',
        { style: commandStyle },
        '⌃ ⇧ B'
      ),
      'Toggle Action Logger'
    )
  );
}