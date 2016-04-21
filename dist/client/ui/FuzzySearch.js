'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _fuse = require('fuse.js');

var _fuse2 = _interopRequireDefault(_fuse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchBoxStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  padding: '8px 10px',
  lineHeight: '24px',
  width: '100%',
  outline: 'none',
  fontSize: 20,
  fontFamily: 'inherit',
  color: '#666',
  boxSizing: 'border-box'
};

var searchBoxWrapper = {
  padding: '4px',
  boxShadow: '0 4px 15px 4px rgba(0,0,0,0.2)',
  borderRadius: 2,
  backgroundColor: '#ffffff'
};

var resultsStyle = {
  backgroundColor: '#fff',
  position: 'relative',
  padding: '12px',
  borderTop: '1px solid #eee',
  color: '#666',
  fontSize: 14
};

var selectedResultStyle = {
  backgroundColor: '#f9f9f9',
  position: 'relative',
  padding: '12px',
  borderTop: '1px solid #eee',
  color: '#666',
  fontSize: 14
};

var resultsWrapperStyle = {
  width: '100%',
  boxShadow: '0px 12px 30px 2px rgba(0, 0, 0, 0.1)',
  border: '1px solid #eee',
  borderTop: 0,
  boxSizing: 'border-box'
};

var kindStyle = {
  float: 'right',
  color: '#bbb',
  fontStyle: 'italic'
};

function mainDivStyle(width) {
  return {
    width: width,
    position: 'fixed',
    left: '50%',
    marginLeft: -(width / 2),
    zIndex: 99
  };
}

var FuzzySearch = function (_Component) {
  (0, _inherits3.default)(FuzzySearch, _Component);

  function FuzzySearch(props) {
    (0, _classCallCheck3.default)(this, FuzzySearch);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FuzzySearch).call(this, props));

    _this.state = {
      results: [],
      selectedIndex: 0
    };
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);
    _this.fuse = new _fuse2.default(props.list, props.options);
    return _this;
  }

  (0, _createClass3.default)(FuzzySearch, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.fuse.set(newProps.list);
    }
  }, {
    key: 'getResultsTemplate',
    value: function getResultsTemplate() {
      var _this2 = this;

      return this.state.results.map(function (val, i) {
        var style = _this2.state.selectedIndex === i ? selectedResultStyle : resultsStyle;
        return _react2.default.createElement(
          'div',
          { key: i, style: style },
          val.story,
          _react2.default.createElement(
            'span',
            { style: kindStyle },
            'in ',
            val.kind
          )
        );
      });
    }
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(e) {
      var _this3 = this;

      if (e.keyCode === 40 && this.state.selectedIndex < this.state.results.length - 1) {
        this.setState({
          selectedIndex: this.state.selectedIndex + 1
        });
      } else if (e.keyCode === 38 && this.state.selectedIndex > 0) {
        this.setState({
          selectedIndex: this.state.selectedIndex - 1
        });
      } else if (e.keyCode === 13) {
        var selected = this.state.results[this.state.selectedIndex];
        this.props.onSelect(selected.kind, selected.story);
        this.setState({
          results: [],
          selectedIndex: 0
        }, function () {
          _this3.refs.searchBox.value = '';
        });
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange() {
      this.setState({
        results: this.fuse.search(this.refs.searchBox.value)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var width = _props.width;


      var mainClass = (0, _classnames2.default)('react-fuzzy-search', className);

      return _react2.default.createElement(
        'div',
        { className: mainClass, style: mainDivStyle(width), onKeyDown: this.handleKeyPress },
        _react2.default.createElement(
          'div',
          { style: searchBoxWrapper },
          _react2.default.createElement('input', { type: 'text', style: searchBoxStyle, onChange: this.handleChange, ref: 'searchBox' })
        ),
        this.state.results && this.state.results.length > 0 && _react2.default.createElement(
          'div',
          { style: resultsWrapperStyle },
          this.getResultsTemplate()
        )
      );
    }
  }]);
  return FuzzySearch;
}(_react.Component);

exports.default = FuzzySearch;


FuzzySearch.propTypes = {
  className: _react.PropTypes.string,
  onSelect: _react.PropTypes.func.isRequired,
  width: _react.PropTypes.number,
  list: _react.PropTypes.array.isRequired,
  options: _react.PropTypes.object.isRequired
};

FuzzySearch.defaultProps = {
  width: 430
};

exports.default = FuzzySearch;