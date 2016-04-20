import isEqual from 'lodash/isEqual';

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
export default function formatActionData(actions) {
  const formatted = [];
  actions.forEach((action, i) => {
    if (i === 0 || !isEqual(action.data, getLastElem(formatted).data) || !action.data) {
      formatted.push({
        data: action.data,
        count: action.count || 1,
        id: formatted.length + 1,
      });
    } else {
      const lastElem = getLastElem(formatted);
      lastElem.count += (action.count || 1);
    }
  });
  return formatted;
}
