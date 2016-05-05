'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientApi = function () {
  function ClientApi(_ref) {
    var pageBus = _ref.pageBus;
    var storyStore = _ref.storyStore;
    (0, _classCallCheck3.default)(this, ClientApi);

    this._pageBus = pageBus;
    this._storyStore = storyStore;
  }

  (0, _createClass3.default)(ClientApi, [{
    key: 'storiesOf',
    value: function storiesOf(kind, m) {
      var _this = this;

      if (m && m.hot) {
        m.hot.dispose(function () {
          _this._storyStore.removeStoryKind(kind);
        });
      }

      var decorators = [];
      var api = {};

      api.add = function (storyName, getStory) {
        // Wrap the getStory function with each decorator. The first
        // decorator will wrap the story function. The second will
        // wrap the first decorator and so on.
        var fn = decorators.reduce(function (decorated, decorator) {
          return function () {
            return decorator(decorated);
          };
        }, getStory);

        // Add the fully decorated getStory function.
        _this._storyStore.addStory(kind, storyName, fn);
        return api;
      };

      api.addDecorator = function (decorator) {
        decorators.push(decorator);
        return api;
      };

      return api;
    }
  }, {
    key: 'action',
    value: function action(name) {
      var pageBus = this._pageBus;

      return function () {
        for (var _len = arguments.length, _args = Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }

        var args = (0, _from2.default)(_args);

        // Remove events from the args. Otherwise, it creates a huge JSON string.
        args = args.map(function (arg) {
          if (arg && typeof arg.preventDefault === 'function') {
            return '[SyntheticEvent]';
          }
          return arg;
        });

        var id = _uuid2.default.v4();
        var data = { name: name, args: args };
        var action = { data: data, id: id };

        pageBus.emit('addAction', { action: action });
      };
    }
  }, {
    key: 'linkTo',
    value: function linkTo(kind, story) {
      var pageBus = this._pageBus;

      return function () {
        var resolvedKind = typeof kind === 'function' ? kind.apply(undefined, arguments) : kind;
        var resolvedStory = typeof story === 'function' ? story.apply(undefined, arguments) : story;

        pageBus.emit('selectStory', { kind: resolvedKind, story: resolvedStory });
      };
    }
  }]);
  return ClientApi;
}();

exports.default = ClientApi;