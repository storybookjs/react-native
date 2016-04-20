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

var _formatActionData = require('./ui/utils/formatActionData');

var _formatActionData2 = _interopRequireDefault(_formatActionData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var idGenerator = 0;

var ClientApi = function () {
  function ClientApi(_ref) {
    var syncedStore = _ref.syncedStore;
    var storyStore = _ref.storyStore;
    (0, _classCallCheck3.default)(this, ClientApi);

    this._syncedStore = syncedStore;
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
      var syncedStore = this._syncedStore;

      return function () {
        for (var _len = arguments.length, _args = Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }

        var args = (0, _from2.default)(_args);

        var _syncedStore$getData = syncedStore.getData();

        var _syncedStore$getData$ = _syncedStore$getData.actions;
        var actions = _syncedStore$getData$ === undefined ? [] : _syncedStore$getData$;

        // Remove events from the args. Otherwise, it creates a huge JSON string.

        if (args[0] && typeof args[0].preventDefault === 'function') {
          args[0] = '[SyntheticEvent]';
        }

        var id = ++idGenerator;
        var data = { name: name, args: args };
        actions = [{ data: data, id: id }].concat(actions);

        // replace consecutive identical actions with single action having
        // count equal to no. of those identical actions.
        var formattedData = (0, _formatActionData2.default)(actions).slice(0, 10);
        syncedStore.setData({ actions: formattedData });
      };
    }
  }, {
    key: 'linkTo',
    value: function linkTo(kind, story) {
      var syncedStore = this._syncedStore;

      return function () {
        var resolvedKind = typeof kind === 'function' ? kind.apply(undefined, arguments) : kind;

        var resolvedStory = void 0;
        if (story) {
          resolvedStory = typeof story === 'function' ? story.apply(undefined, arguments) : story;
        } else {
          var _syncedStore$getData2 = syncedStore.getData();

          var storyStore = _syncedStore$getData2.storyStore;


          resolvedStory = storyStore.find(function (item) {
            return item.kind === kind;
          }).stories[0];
        }

        syncedStore.setData({
          selectedKind: resolvedKind,
          selectedStory: resolvedStory
        });
      };
    }
  }]);
  return ClientApi;
}();

exports.default = ClientApi;