import isEqual from 'lodash/isEqual';

function getLastElem(arr) {
  return arr[arr.length - 1];
}

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
