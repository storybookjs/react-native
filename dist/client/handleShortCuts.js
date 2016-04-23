"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

exports.default = handleShortCuts;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleShortCuts(e, syncedStore) {
  if (e.keyCode === 79 && e.ctrlKey && e.shiftKey) {
    var newData = (0, _extends3.default)({}, syncedStore.getData());
    newData.showSearchBox = !newData.showSearchBox;
    syncedStore.setData(newData);
  } else if (e.ctrlKey && e.keyCode === 76 && e.shiftKey) {
    var _newData = (0, _extends3.default)({}, syncedStore.getData());
    _newData.showControls = !_newData.showControls;
    syncedStore.setData(_newData);
  } else if (e.keyCode === 27) {
    var _newData2 = (0, _extends3.default)({}, syncedStore.data);
    _newData2.showSearchBox = false;
    syncedStore.setData(_newData2);
  } else if (e.keyCode === 66 && e.ctrlKey && e.shiftKey) {
    var _newData3 = (0, _extends3.default)({}, syncedStore.getData());
    _newData3.showLogger = !_newData3.showLogger;
    syncedStore.setData(_newData3);
  }
}