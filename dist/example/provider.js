'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _events = require('events');

var _storybookUi = require('@kadira/storybook-ui');

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// example stories
var stories = [{ kind: 'Component 1', stories: ['Example State 1', 'Example State 2'] }, { kind: 'Component 2', stories: ['Example State 1'] }];

var ExampleProvider = function (_Provider) {
  _inherits(ExampleProvider, _Provider);

  function ExampleProvider() {
    _classCallCheck(this, ExampleProvider);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExampleProvider).call(this));

    _this.channel = new _events.EventEmitter();
    _storybookAddons2.default.setChannel(_this.channel);
    return _this;
  }

  _createClass(ExampleProvider, [{
    key: 'getPanels',
    value: function getPanels() {
      return _storybookAddons2.default.getPanels();
    }
  }, {
    key: 'renderPreview',
    value: function renderPreview(kind, story) {
      return _react2.default.createElement(_preview2.default, null);
    }
  }, {
    key: 'handleAPI',
    value: function handleAPI(api) {
      api.setOptions({ name: 'STORY-LINKS' });
      api.setStories(stories);
      _storybookAddons2.default.loadAddons(api);
    }
  }]);

  return ExampleProvider;
}(_storybookUi.Provider);

exports.default = ExampleProvider;