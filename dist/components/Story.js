'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRemarkable = require('react-remarkable');

var _reactRemarkable2 = _interopRequireDefault(_reactRemarkable);

var _Node = require('./Node.js');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropTypesMap = new _map2.default();
for (var typeName in _react2.default.PropTypes) {
  if (!_react2.default.PropTypes.hasOwnProperty(typeName)) {
    continue;
  }
  var type = _react2.default.PropTypes[typeName];
  PropTypesMap.set(type, typeName);
}

var Story = function (_React$Component) {
  (0, _inherits3.default)(Story, _React$Component);

  function Story() {
    var _Object$getPrototypeO;

    (0, _classCallCheck3.default)(this, Story);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(Story)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.stylesheet = {
      link: {
        base: {
          fontFamily: 'sans-serif',
          fontSize: 12,
          display: 'block',
          position: 'absolute',
          textDecoration: 'none',
          background: '#28c',
          color: '#fff',
          padding: '5px 15px',
          cursor: 'pointer'
        },
        topRight: {
          top: 0,
          right: 0,
          borderRadius: '0 0 0 5px'
        }
      },
      info: {
        position: 'absolute',
        background: 'white',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0 40px',
        overflow: 'auto'
      }
    };

    _this.state = { open: false };
    return _this;
  }

  (0, _createClass3.default)(Story, [{
    key: 'openInfo',
    value: function openInfo() {
      this.setState({ open: true });
      return false;
    }
  }, {
    key: 'closeInfo',
    value: function closeInfo() {
      this.setState({ open: false });
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.showInline) {
        return this.renderInline();
      }
      return this.renderOverlay();
    }
  }, {
    key: 'renderInline',
    value: function renderInline() {
      return _react2.default.createElement(
        'div',
        null,
        this.props.children,
        _react2.default.createElement(
          'div',
          { className: 'storybook-story-info-page' },
          _react2.default.createElement(
            'div',
            { className: 'storybook-story-info-body storybook-story-info-body-inline' },
            this._getInfoContent(),
            this._getSourceCode(),
            this._getPropTables()
          )
        )
      );
    }
  }, {
    key: 'renderOverlay',
    value: function renderOverlay() {
      var _this2 = this;

      var linkStyle = (0, _extends3.default)({}, this.stylesheet.link.base, this.stylesheet.link.topRight);
      var infoStyle = (0, _assign2.default)({}, this.stylesheet.info);
      if (!this.state.open) {
        infoStyle.display = 'none';
      }

      return _react2.default.createElement(
        'div',
        null,
        this.props.children,
        _react2.default.createElement(
          'a',
          { style: linkStyle, onClick: function onClick() {
              return _this2.openInfo();
            } },
          '?'
        ),
        _react2.default.createElement(
          'div',
          { style: infoStyle },
          _react2.default.createElement(
            'a',
            { style: linkStyle, onClick: function onClick() {
                return _this2.closeInfo();
              } },
            '×'
          ),
          _react2.default.createElement(
            'div',
            { className: 'storybook-story-info-page' },
            _react2.default.createElement(
              'div',
              { className: 'storybook-story-info-body' },
              this._getInfoHeader(),
              this._getInfoContent(),
              this._getSourceCode(),
              this._getPropTables()
            )
          )
        )
      );
    }
  }, {
    key: '_getInfoHeader',
    value: function _getInfoHeader() {
      if (!this.props.context || !this.props.showHeader) {
        return null;
      }

      return _react2.default.createElement(
        'header',
        null,
        _react2.default.createElement(
          'h1',
          null,
          this.props.context.kind
        ),
        _react2.default.createElement(
          'h2',
          null,
          this.props.context.story
        )
      );
    }
  }, {
    key: '_getInfoContent',
    value: function _getInfoContent() {
      if (!this.props.info) {
        return '';
      }
      var lines = this.props.info.split('\n');
      while (lines[0].trim() === '') {
        lines.shift();
      }
      var padding = 0;
      var matches = lines[0].match(/^ */);
      if (matches) {
        padding = matches[0].length;
      }
      var source = lines.map(function (s) {
        return s.slice(padding);
      }).join('\n');
      return _react2.default.createElement(_reactRemarkable2.default, { source: source });
    }
  }, {
    key: '_getSourceCode',
    value: function _getSourceCode() {
      if (!this.props.showSource) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          null,
          'Example Source'
        ),
        _react2.default.createElement(
          'pre',
          null,
          _react2.default.Children.map(this.props.children, function (root) {
            return _react2.default.createElement(_Node2.default, { depth: 0, node: root });
          })
        )
      );
    }
  }, {
    key: '_getPropTables',
    value: function _getPropTables() {
      if (!this.props.propTables) {
        return '';
      }
      var tables = this.props.propTables.map(this._getPropTable.bind(this));
      return _react2.default.createElement(
        'div',
        null,
        tables
      );
    }
  }, {
    key: '_getPropTable',
    value: function _getPropTable(Comp) {
      if (!Comp) {
        return '';
      }

      var rows = [];
      for (var property in Comp.propTypes) {
        if (!Comp.propTypes.hasOwnProperty(property)) {
          continue;
        }
        var _type = Comp.propTypes[property];
        var propType = PropTypesMap.get(_type) || '-';
        var required = _type.isRequired === undefined ? 'yes' : 'no';
        var defaults = this._getDefaultProp(property);
        rows.push({ property: property, propType: propType, required: required, defaults: defaults });
      }

      return _react2.default.createElement(
        'main',
        null,
        _react2.default.createElement(
          'h3',
          null,
          Comp.displayName || Comp.name,
          ' PropTypes'
        ),
        _react2.default.createElement(
          'table',
          null,
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'th',
                null,
                'property'
              ),
              _react2.default.createElement(
                'th',
                null,
                'propType'
              ),
              _react2.default.createElement(
                'th',
                null,
                'required'
              ),
              _react2.default.createElement(
                'th',
                null,
                'defaults'
              )
            )
          ),
          _react2.default.createElement(
            'tbody',
            null,
            rows.map(function (row) {
              return _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'td',
                  null,
                  row.property
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  row.propType
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  row.required
                ),
                _react2.default.createElement(
                  'td',
                  null,
                  row.defaults
                )
              );
            })
          )
        )
      );
    }
  }, {
    key: '_getDefaultProp',
    value: function _getDefaultProp(property) {
      return '-';
    }
  }]);
  return Story;
}(_react2.default.Component);

Story.displayName = 'Story';
Story.propTypes = {
  context: _react2.default.PropTypes.object,
  info: _react2.default.PropTypes.string,
  propTables: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.func),
  showInline: _react2.default.PropTypes.bool,
  showHeader: _react2.default.PropTypes.bool,
  showSource: _react2.default.PropTypes.bool
};
Story.defaultProps = {
  showInline: false,
  showHeader: true,
  showSource: true
};
exports.default = Story;