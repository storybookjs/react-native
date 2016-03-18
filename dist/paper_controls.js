'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaperControls = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PaperControls = exports.PaperControls = function (_React$Component) {
  (0, _inherits3.default)(PaperControls, _React$Component);

  function PaperControls() {
    (0, _classCallCheck3.default)(this, PaperControls);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PaperControls).apply(this, arguments));
  }

  (0, _createClass3.default)(PaperControls, [{
    key: 'render',
    value: function render() {
      var paperNames = this.getPaperNames();
      var mainStyle = {
        fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
        padding: '10px',
        marginRight: '10px',
        color: '#444',
        borderRight: '3px solid #DDD',
        minHeight: '1500px'
      };

      var h1Style = {
        textTransform: 'uppercase'
      };

      return _react2.default.createElement(
        'div',
        { style: mainStyle },
        _react2.default.createElement(
          'h3',
          { style: h1Style },
          'Available Papers'
        ),
        _react2.default.createElement(
          'div',
          null,
          paperNames.map(this.renderPaper.bind(this))
        )
      );
    }
  }, {
    key: 'renderPaper',
    value: function renderPaper(paper) {
      var paperStyle = {
        fontSize: 16,
        padding: '10px 0px',
        cursor: 'pointer',
        borderBottom: '1px solid #EEE'
      };

      var selectedPaper = this.props.selectedPaper;

      if (paper === selectedPaper) {
        var blockNames = this.getBlocks(selectedPaper);
        paperStyle.fontWeight = 'bold';
        return _react2.default.createElement(
          'div',
          { key: paper },
          _react2.default.createElement(
            'div',
            {
              style: paperStyle,
              onClick: this.fireOnPaper.bind(this, paper)
            },
            paper
          ),
          _react2.default.createElement(
            'div',
            null,
            blockNames.map(this.renderBlock.bind(this))
          )
        );
      }

      return _react2.default.createElement(
        'div',
        {
          key: paper,
          style: paperStyle,
          onClick: this.fireOnPaper.bind(this, paper)
        },
        paper
      );
    }
  }, {
    key: 'renderBlock',
    value: function renderBlock(block) {
      var selectedBlock = this.props.selectedBlock;

      var blockStyle = {
        fontSize: 14,
        padding: '8px 0px 8px 3px',
        cursor: 'pointer'
      };

      if (block === selectedBlock) {
        blockStyle.fontWeight = 'bold';
      }
      return _react2.default.createElement(
        'div',
        {
          key: block,
          style: blockStyle,
          onClick: this.fireOnBlock.bind(this, block)
        },
        block
      );
    }
  }, {
    key: 'getPaperNames',
    value: function getPaperNames() {
      var _props = this.props;
      var papers = _props.papers;
      var selectedPaper = _props.selectedPaper;

      if (!papers) {
        return [];
      }

      return (0, _keys2.default)(papers).sort(function (name) {
        return name === selectedPaper ? -1 : 1;
      });
    }
  }, {
    key: 'getBlocks',
    value: function getBlocks(paperName) {
      var papers = this.props.papers;

      var blocks = papers[paperName];
      return (0, _keys2.default)(blocks);
    }
  }, {
    key: 'fireOnPaper',
    value: function fireOnPaper(paper) {
      var _props$onPaper = this.props.onPaper;
      var onPaper = _props$onPaper === undefined ? function () {} : _props$onPaper;

      onPaper(paper);
    }
  }, {
    key: 'fireOnBlock',
    value: function fireOnBlock(block) {
      var _props$onBlock = this.props.onBlock;
      var onBlock = _props$onBlock === undefined ? function () {} : _props$onBlock;

      onBlock(block);
    }
  }]);
  return PaperControls;
}(_react2.default.Component);