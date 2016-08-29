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

var _storybookUi = require('@kadira/storybook-ui');

var _storybookChannelWebsocket = require('@kadira/storybook-channel-websocket');

var _storybookChannelWebsocket2 = _interopRequireDefault(_storybookChannelWebsocket);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactProvider = function (_Provider) {
  (0, _inherits3.default)(ReactProvider, _Provider);

  function ReactProvider(_ref) {
    var url = _ref.url;
    (0, _classCallCheck3.default)(this, ReactProvider);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ReactProvider.__proto__ || (0, _getPrototypeOf2.default)(ReactProvider)).call(this));

    _this.selection = null;
    _this.channel = _storybookAddons2.default.getChannel();
    if (!_this.channel) {
      _this.channel = (0, _storybookChannelWebsocket2.default)({ url: url });
      _storybookAddons2.default.setChannel(_this.channel);
    }
    return _this;
  }

  (0, _createClass3.default)(ReactProvider, [{
    key: 'getPanels',
    value: function getPanels() {
      return _storybookAddons2.default.getPanels();
    }
  }, {
    key: 'renderPreview',
    value: function renderPreview(kind, story) {
      this.selection = { kind: kind, story: story };
      this.channel.emit('setCurrentStory', { kind: kind, story: story });
      var renderPreview = _storybookAddons2.default.getPreview();
      if (renderPreview) {
        return renderPreview(kind, story);
      }
      return null;
    }
  }, {
    key: 'handleAPI',
    value: function handleAPI(api) {
      var _this2 = this;

      api.onStory(function (kind, story) {
        _this2.selection = { kind: kind, story: story };
        _this2.channel.emit('setCurrentStory', _this2.selection);
      });
      this.channel.on('setStories', function (data) {
        api.setStories(data.stories);
      });
      this.channel.on('getCurrentStory', function () {
        _this2.channel.emit('setCurrentStory', _this2.selection);
      });
      this.channel.emit('getStories');
      _storybookAddons2.default.loadAddons(api);
    }
  }]);
  return ReactProvider;
}(_storybookUi.Provider);

exports.default = ReactProvider;