'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddonStore = exports.AddonStore = function () {
  function AddonStore() {
    _classCallCheck(this, AddonStore);

    this._loaders = {};
    this._panels = {};
    this._store = {};
  }

  _createClass(AddonStore, [{
    key: 'getPanels',
    value: function getPanels() {
      return this._panels;
    }
  }, {
    key: 'setChannel',
    value: function setChannel(channel, name) {
      this._set('channel', channel, name);
    }
  }, {
    key: 'getChannel',
    value: function getChannel() {
      return this._get('channel');
    }
  }, {
    key: 'setDatabase',
    value: function setDatabase(database, name) {
      this._set('database', database, name);
    }
  }, {
    key: 'getDatabase',
    value: function getDatabase() {
      return this._get('database');
    }
  }, {
    key: 'setPreview',
    value: function setPreview(preview, name) {
      this._set('preview', preview, name);
    }
  }, {
    key: 'getPreview',
    value: function getPreview() {
      return this._get('preview');
    }
  }, {
    key: 'setPreviewDecorator',
    value: function setPreviewDecorator(decorator, name) {
      this._set('preview decorator', decorator, name);
    }
  }, {
    key: 'getPreviewDecorator',
    value: function getPreviewDecorator() {
      return this._get('preview decorator');
    }
  }, {
    key: 'addPanel',
    value: function addPanel(name, panel) {
      this._panels[name] = panel;
    }
  }, {
    key: 'register',
    value: function register(name, loader) {
      this._loaders[name] = loader;
    }
  }, {
    key: 'loadAddons',
    value: function loadAddons(api) {
      var _this = this;

      Object.keys(this._loaders).map(function (name) {
        return _this._loaders[name];
      }).forEach(function (loader) {
        return loader(api);
      });
    }
  }, {
    key: '_set',
    value: function _set(key, value, name) {
      if (this._store[key]) {
        throw new Error('There\'s ' + key + ' called "' + this._store[key].name + '". You can only have a single ' + key + '.');
      }

      this._store[key] = { value: value, name: name };
    }
  }, {
    key: '_get',
    value: function _get(key) {
      var item = this._store[key];
      if (!item) {
        return null;
      }

      return item.value;
    }
  }]);

  return AddonStore;
}();

exports.default = new AddonStore();