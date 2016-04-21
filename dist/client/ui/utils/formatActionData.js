'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatActionData;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLastElem(arr) {
  return arr[arr.length - 1];
}

/**
 * Takes an array and checks consecutive arrays. If they are same then replaces
 * consecutive identical objects (refers to .data of each object) with single
 * object and sets the count in the object to the number of identical consecutive
 * objects.
 *
 * @param actions  An array of all the actions
 * @returns {Array}
 */
function formatActionData(actions) {
  var formatted = [];
  actions.forEach(function (action, i) {
    if (i === 0 || !(0, _isEqual2.default)(action.data, getLastElem(formatted).data) || !action.data) {
      formatted.push({
        data: action.data,
        count: action.count || 1,
        id: action.id
      });
    } else {
      var lastElem = getLastElem(formatted);
      lastElem.count += action.count || 1;
    }
  });
  return formatted;
}