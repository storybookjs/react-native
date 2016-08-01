"use strict";

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
    this._context = {
      channel: null
    };
  }

  _createClass(AddonStore, [{
    key: "getContext",
    value: function getContext() {
      return this._context;
    }
  }, {
    key: "setContext",
    value: function setContext(context) {
      this._context = context;
    }
  }, {
    key: "register",
    value: function register(name, loader) {
      this._loaders[name] = loader;
    }
  }, {
    key: "loadAddons",
    value: function loadAddons() {
      var _this = this;

      Object.keys(this._loaders).map(function (name) {
        return _this._loaders[name];
      }).forEach(function (loader) {
        return loader(_this._context);
      });
    }
  }]);

  return AddonStore;
}();

exports.default = new AddonStore();