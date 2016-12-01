'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _PropForm = require('./PropForm');

var _PropForm2 = _interopRequireDefault(_PropForm);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  panelWrapper: {
    width: '100%'
  },
  panel: {
    padding: '5px',
    width: 'auto',
    position: 'relative'
  },
  noKnobs: {
    fontFamily: '\n      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",\n      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif\n    ',
    display: 'inline',
    width: '100%',
    textAlign: 'center',
    color: 'rgb(190, 190, 190)',
    padding: '10px'
  },
  resetButton: {
    position: 'absolute',
    bottom: 11,
    right: 10,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none'
  }
};

var Panel = function (_React$Component) {
  (0, _inherits3.default)(Panel, _React$Component);

  function Panel(props) {
    (0, _classCallCheck3.default)(this, Panel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Panel.__proto__ || (0, _getPrototypeOf2.default)(Panel)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.setKnobs = _this.setKnobs.bind(_this);
    _this.reset = _this.reset.bind(_this);

    _this.state = { knobs: {} };
    _this.loadedFromUrl = false;
    _this.props.channel.on('addon:knobs:setKnobs', _this.setKnobs);
    return _this;
  }

  (0, _createClass3.default)(Panel, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.channel.removeListener('addon:knobs:setKnobs', this.setKnobs);
    }
  }, {
    key: 'setKnobs',
    value: function setKnobs(knobs) {
      var _this2 = this;

      var queryParams = {};
      var _props = this.props,
          api = _props.api,
          channel = _props.channel;


      (0, _keys2.default)(knobs).forEach(function (name) {
        var knob = knobs[name];
        // For the first time, get values from the URL and set them.
        if (!_this2.loadedFromUrl) {
          var urlValue = api.getQueryParam('knob-' + name);

          if (urlValue !== undefined) {
            // If the knob value present in url
            knob.value = _types2.default[knob.type].deserialize(urlValue);
            channel.emit('addon:knobs:knobChange', knob);
          }
        }

        queryParams['knob-' + name] = _types2.default[knob.type].serialize(knob.value);
      });

      this.loadedFromUrl = true;
      api.setQueryParams(queryParams);
      this.setState({ knobs: knobs });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.props.channel.emit('addon:knobs:reset');
    }
  }, {
    key: 'handleChange',
    value: function handleChange(changedKnob) {
      var _props2 = this.props,
          api = _props2.api,
          channel = _props2.channel;
      var knobs = this.state.knobs;
      var name = changedKnob.name,
          type = changedKnob.type,
          value = changedKnob.value;

      var newKnobs = (0, _extends3.default)({}, knobs);
      newKnobs[name] = (0, _extends3.default)({}, newKnobs[name], changedKnob);

      this.setState({ knobs: newKnobs });

      var queryParams = {};
      queryParams['knob-' + name] = _types2.default[type].serialize(value);

      api.setQueryParams(queryParams);
      channel.emit('addon:knobs:knobChange', changedKnob);
    }
  }, {
    key: 'render',
    value: function render() {
      var knobs = this.state.knobs;

      var knobsArray = (0, _keys2.default)(knobs).filter(function (key) {
        return knobs[key].used;
      }).map(function (key) {
        return knobs[key];
      });

      if (knobsArray.length === 0) {
        return _react2.default.createElement(
          'div',
          { style: styles.noKnobs },
          'NO KNOBS'
        );
      }

      return _react2.default.createElement(
        'div',
        { style: styles.panelWrapper },
        _react2.default.createElement(
          'div',
          { style: styles.panel },
          _react2.default.createElement(_PropForm2.default, { knobs: knobsArray, onFieldChange: this.handleChange })
        ),
        _react2.default.createElement(
          'button',
          { style: styles.resetButton, onClick: this.reset },
          'RESET'
        )
      );
    }
  }]);
  return Panel;
}(_react2.default.Component);

exports.default = Panel;


Panel.propTypes = {
  channel: _react2.default.PropTypes.object,
  onReset: _react2.default.PropTypes.object,
  api: _react2.default.PropTypes.object
};