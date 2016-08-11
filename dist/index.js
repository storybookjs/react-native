'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Story = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Story2 = require('./components/Story');

var _Story3 = _interopRequireDefault(_Story2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Story = exports.Story = _Story3.default;

var defaultOptions = {
  inline: false,
  header: true,
  source: true
};

exports.default = {
  addWithInfo: function addWithInfo(storyName, info, storyFn, _options) {
    if (typeof storyFn !== 'function') {
      if (typeof info === 'function') {
        _options = storyFn;
        storyFn = info;
        info = '';
      } else {
        throw new Error('No story defining function has been specified');
      }
    }

    var options = (0, _extends3.default)({}, defaultOptions, _options);

    // props.propTables can only be either an array of components or null
    // propTables option is allowed to be set to 'false' (a boolean)
    // if the option is false, replace it with null to avoid react warnings
    if (!options.propTables) {
      options.propTables = null;
    }

    this.add(storyName, function (context) {
      var props = {
        info: info,
        context: context,
        showInline: Boolean(options.inline),
        showHeader: Boolean(options.header),
        showSource: Boolean(options.source),
        propTables: options.propTables
      };

      return _react2.default.createElement(
        Story,
        props,
        storyFn(context)
      );
    });
  }
};