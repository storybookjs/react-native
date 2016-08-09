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

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookUi = require('@kadira/storybook-ui');

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _storybookChannelPagebus = require('@kadira/storybook-channel-pagebus');

var _storybookChannelPagebus2 = _interopRequireDefault(_storybookChannelPagebus);

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactProvider = function (_Provider) {
  (0, _inherits3.default)(ReactProvider, _Provider);

  function ReactProvider() {
    (0, _classCallCheck3.default)(this, ReactProvider);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ReactProvider).call(this));

    _this.dataId = _uuid2.default.v4();
    _this.channel = (0, _storybookChannelPagebus2.default)({ key: _this.dataId });
    _storybookAddons2.default.setChannel(_this.channel);
    return _this;
  }

  (0, _createClass3.default)(ReactProvider, [{
    key: 'getPanels',
    value: function getPanels() {
      return _storybookAddons2.default.getPanels();
    }
  }, {
    key: 'renderPreview',
    value: function renderPreview(selectedKind, selectedStory) {
      var queryParams = {
        dataId: this.dataId,
        selectedKind: selectedKind,
        selectedStory: selectedStory
      };

      var queryString = _qs2.default.stringify(queryParams);
      var url = 'iframe.html?' + queryString;
      return _react2.default.createElement(_preview2.default, { url: url });
    }
  }, {
    key: 'handleAPI',
    value: function handleAPI(api) {
      var _this2 = this;

      api.onStory(function (kind, story) {
        _this2.channel.emit('setCurrentStory', { kind: kind, story: story });
      });
      this.channel.on('setStories', function (data) {
        api.setStories(data.stories);
      });
      this.channel.on('selectStory', function (data) {
        api.selectStory(data.kind, data.story);
      });
      this.channel.on('applyShortcut', function (data) {
        api.handleShortcut(data.event);
      });
      _storybookAddons2.default.loadAddons(api);
    }
  }]);
  return ReactProvider;
}(_storybookUi.Provider);

exports.default = ReactProvider;