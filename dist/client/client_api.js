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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

      var add = function add(storyName, fn) {
        _this._storyStore.addStory(kind, storyName, fn);
        return { add: add };
      };

      return { add: add };
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

        if (args[0] && args[0].constructor && /Synthetic/.test(args[0].constructor.name)) {
          args[0] = '[' + args[0].constructor.name + ']';
        }

        actions = [{ name: name, args: args }].concat(actions.slice(0, 4));
        syncedStore.setData({ actions: actions });
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