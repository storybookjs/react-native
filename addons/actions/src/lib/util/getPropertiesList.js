const { hasOwnProperty } = Object.prototype;

export default function getPropertiesList(value) {
  const keys = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const name in value) {
    // noinspection JSUnfilteredForInLoop
    if (
      keys.indexOf(name) === -1 &&
      !(typeof value[name] === 'function' && !hasOwnProperty.call(value, name))
    ) {
      keys.push(name);
    }
  }

  return keys;
}
