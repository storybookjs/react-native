'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _storybookChannelWebsocket = require('@kadira/storybook-channel-websocket');

var _storybookChannelWebsocket2 = _interopRequireDefault(_storybookChannelWebsocket);

var _events = require('events');

var _story_store = require('./story_store');

var _story_store2 = _interopRequireDefault(_story_store);

var _story_kind = require('./story_kind');

var _story_kind2 = _interopRequireDefault(_story_kind);

var _StoryView = require('./components/StoryView');

var _StoryView2 = _interopRequireDefault(_StoryView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Preview = function () {
  function Preview() {
    (0, _classCallCheck3.default)(this, Preview);

    this._addons = {};
    this._decorators = [];
    this._stories = new _story_store2.default();
    this._events = new _events.EventEmitter();
  }

  (0, _createClass3.default)(Preview, [{
    key: 'storiesOf',
    value: function storiesOf(kind, module) {
      if (module && module.hot) {
        // TODO remove the kind on dispose
      }
      return new _story_kind2.default(this._stories, this._addons, this._decorators, kind);
    }
  }, {
    key: 'setAddon',
    value: function setAddon(addon) {
      (0, _assign2.default)(this._addons, addon);
    }
  }, {
    key: 'addDecorator',
    value: function addDecorator(decorator) {
      this._decorators.push(decorator);
    }
  }, {
    key: 'configure',
    value: function configure(loadStories, module) {
      var _this = this;

      loadStories();
      if (module && module.hot) {
        module.hot.accept(function () {
          return _this._sendSetStories();
        });
        // TODO remove all global decorators on dispose
      }
    }
  }, {
    key: 'getStorybook',
    value: function getStorybook() {
      var _this2 = this;

      return this._stories.getStoryKinds().map(function (kind) {
        var stories = _this2._stories.getStories(kind).map(function (name) {
          var render = _this2._stories.getStory(kind, name);
          return { name: name, render: render };
        });
        return { kind: kind, stories: stories };
      });
    }
  }, {
    key: 'getStorybookUI',
    value: function getStorybookUI(_ref) {
      var _this3 = this;

      var url = _ref.url;

      return function () {
        var channel = _storybookAddons2.default.getChannel();
        if (!channel) {
          channel = (0, _storybookChannelWebsocket2.default)({ url: url });
          _storybookAddons2.default.setChannel(channel);
        }
        channel.on('getStories', function (d) {
          return _this3._sendSetStories();
        });
        channel.on('setCurrentStory', function (d) {
          return _this3._selectStory(d);
        });
        _this3._sendSetStories();
        // finally return the preview component
        return _react2.default.createElement(_StoryView2.default, { events: _this3._events });
      };
    }
  }, {
    key: '_sendSetStories',
    value: function _sendSetStories() {
      var channel = _storybookAddons2.default.getChannel();
      if (channel) {
        var stories = this._stories.dumpStoryBook();
        channel.emit('setStories', { stories: stories });
      }
    }
  }, {
    key: '_selectStory',
    value: function _selectStory(selection) {
      var kind = selection.kind;
      var story = selection.story;

      var storyFn = this._stories.getStory(kind, story);
      this._events.emit('story', storyFn);
    }
  }]);
  return Preview;
}();

exports.default = Preview;