import isEqual from 'lodash/isEqual';

function getLastElem (arr) {
  return arr[arr.length-1];
}

export default function formatActionData(actions) {
  let formatted = [];
  actions.map((action, i) => {
    if(i === 0 || !isEqual(action, getLastElem(formatted).data)){
      formatted.push({
        data : action,
        count : 1,
        id    : formatted.length + 1
      })
    } else {
      const lastElem = getLastElem(formatted);
      lastElem.count += 1;
    }
  });
  return formatted;
}
