'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pageBus = require('page-bus');

var _pageBus2 = _interopRequireDefault(_pageBus);

var _storybookUi = require('@kadira/storybook-ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactProvider = function (_Provider) {
  (0, _inherits3.default)(ReactProvider, _Provider);

  function ReactProvider() {
    (0, _classCallCheck3.default)(this, ReactProvider);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ReactProvider).call(this));

    _this.dataId = _uuid2.default.v4();
    return _this;
  }

  (0, _createClass3.default)(ReactProvider, [{
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
      var dataId = this.dataId;
      var bus = (0, _pageBus2.default)();

      api.onStory(function (kind, story) {
        var payload = {
          kind: kind,
          story: story
        };

        bus.emit(dataId + '.setCurrentStory', (0, _stringify2.default)(payload));
      });

      // watch pageBus and put both actions and stories.
      bus.on(dataId + '.addAction', function (payload) {
        var data = JSON.parse(payload);
        api.addAction(data.action);
      });

      bus.on(dataId + '.setStories', function (payload) {
        var data = JSON.parse(payload);
        api.setStories(data.stories);
      });

      bus.on(dataId + '.selectStory', function (payload) {
        var data = JSON.parse(payload);
        api.selectStory(data.kind, data.story);
      });

      bus.on(dataId + '.applyShortcut', function (payload) {
        var data = JSON.parse(payload);
        api.handleShortcut(data.event);
      });
    }
  }]);
  return ReactProvider;
}(_storybookUi.Provider);

exports.default = ReactProvider;