"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StoryKindApi = function () {
  function StoryKindApi(stories, addons, decorators, kind) {
    (0, _classCallCheck3.default)(this, StoryKindApi);

    this.kind = kind;
    this._stories = stories;
    this._decorators = decorators.slice();
    (0, _assign2.default)(this, addons);
  }

  (0, _createClass3.default)(StoryKindApi, [{
    key: "addDecorator",
    value: function addDecorator(decorator) {
      this._decorators.push(decorator);
      return this;
    }
  }, {
    key: "add",
    value: function add(story, fn) {
      var decorated = this._decorate(fn);
      this._stories.addStory(this.kind, story, decorated);
      return this;
    }
  }, {
    key: "_decorate",
    value: function _decorate(fn) {
      return this._decorators.reduce(function (decorated, decorator) {
        return function (context) {
          var _fn = function _fn() {
            return decorated(context);
          };
          return decorator(_fn, context);
        };
      }, fn);
    }
  }]);
  return StoryKindApi;
}();

exports.default = StoryKindApi;