'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _WrapStory = require('./components/WrapStory');

var _WrapStory2 = _interopRequireDefault(_WrapStory);

var _KnobStore = require('./KnobStore');

var _KnobStore2 = _interopRequireDefault(_KnobStore);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is used by _mayCallChannel to determine how long to wait to before triggering a panel update
var PANEL_UPDATE_INTERVAL = 400;

var KnobManager = function () {
  function KnobManager() {
    (0, _classCallCheck3.default)(this, KnobManager);

    this.knobStore = null;
    this.knobStoreMap = {};
  }

  (0, _createClass3.default)(KnobManager, [{
    key: 'knob',
    value: function knob(name, options) {
      this._mayCallChannel();

      var knobStore = this.knobStore;
      var existingKnob = knobStore.get(name);
      // We need to return the value set by the knob editor via this.
      // But, if the user changes the code for the defaultValue we should set
      // that value instead.
      if (existingKnob && (0, _deepEqual2.default)(options.value, existingKnob.defaultValue)) {
        return existingKnob.value;
      }

      var defaultValue = options.value;
      var knobInfo = (0, _extends3.default)({}, options, {
        name: name,
        defaultValue: defaultValue
      });

      knobStore.set(name, knobInfo);
      return knobStore.get(name).value;
    }
  }, {
    key: 'wrapStory',
    value: function wrapStory(channel, storyFn, context) {
      this.channel = channel;
      var key = context.kind + ':::' + context.story;
      var knobStore = this.knobStoreMap[key];

      if (!knobStore) {
        knobStore = this.knobStoreMap[key] = new _KnobStore2.default();
      }

      this.knobStore = knobStore;
      knobStore.markAllUnused();
      var initialContent = storyFn(context);
      var props = { context: context, storyFn: storyFn, channel: channel, knobStore: knobStore, initialContent: initialContent };
      return _react2.default.createElement(_WrapStory2.default, props);
    }
  }, {
    key: '_mayCallChannel',
    value: function _mayCallChannel() {
      var _this = this;

      // Re rendering of the story may cause changes to the knobStore. Some new knobs maybe added and
      // Some knobs may go unused. So we need to update the panel accordingly. For example remove the
      // unused knobs from the panel. This function sends the `setKnobs` message to the channel
      // triggering a panel re-render.

      if (this.calling) {
        // If a call to channel has already registered ignore this call.
        // Once the previous call is completed all the changes to knobStore including the one that
        // triggered this, will be added to the panel.
        // This avoids emitting to the channel within very short periods of time.
        return;
      }
      this.calling = true;

      setTimeout(function () {
        _this.calling = false;
        // emit to the channel and trigger a panel re-render
        _this.channel.emit('addon:knobs:setKnobs', _this.knobStore.getAll());
      }, PANEL_UPDATE_INTERVAL);
    }
  }]);
  return KnobManager;
}();

exports.default = KnobManager;