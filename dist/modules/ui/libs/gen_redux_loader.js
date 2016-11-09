"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getReduxLoader;
function getReduxLoader(fn) {
  return function (props, onData, env) {
    var _env$context = env.context(),
        reduxStore = _env$context.reduxStore;

    var processState = function processState() {
      try {
        var state = reduxStore.getState();
        var data = fn(state, props, env);
        onData(null, data);
      } catch (ex) {
        onData(ex);
      }
    };

    processState();
    reduxStore.subscribe(processState);
  };
}