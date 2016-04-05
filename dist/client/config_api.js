"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConfigApi = function () {
  function ConfigApi(_ref) {
    var syncedStore = _ref.syncedStore;
    var storyStore = _ref.storyStore;
    (0, _classCallCheck3.default)(this, ConfigApi);

    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  (0, _createClass3.default)(ConfigApi, [{
    key: "_renderMain",
    value: function _renderMain(loaders) {
      if (loaders) loaders();

      var data = this._syncedStore.getData();
      data.error = null;
      data.__updatedAt = Date.now();
      data.storyStore = this._storyStore.dumpStoryBook();

      if (!this._storyStore.hasStoryKind(data.selectedKind)) {
        data.selectedKind = this._storyStore.getStoryKinds()[0];
      }

      if (this._storyStore.hasStoryKind(data.selectedKind)) {
        if (!this._storyStore.hasStory(data.selectedKind, data.selectedStory)) {
          data.selectedStory = this._storyStore.getStories(data.selectedKind, data.selectedStory)[0];
        }
      }

      this._syncedStore.setData(data);
    }
  }, {
    key: "_renderError",
    value: function _renderError(e) {
      var data = this._syncedStore.getData();
      var stack = e.stack;
      var message = e.message;

      data.error = { stack: stack, message: message };

      this._syncedStore.setData(data);
    }
  }, {
    key: "configure",
    value: function configure(loaders, module) {
      var _this = this;

      var render = function render() {
        try {
          _this._renderMain(loaders);
        } catch (error) {
          _this._renderError(error);
        }
      };

      if (module.hot) {
        module.hot.accept(function () {
          setTimeout(render);
        });
      }

      render();
    }
  }]);
  return ConfigApi;
}();

exports.default = ConfigApi;