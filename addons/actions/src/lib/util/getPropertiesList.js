const { hasOwnProperty } = Object.prototype;

export default function getPropertiesList(value) {
  const keys = [];

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in value) {
    try {
      if (hasOwnProperty.call(value, name) || typeof value[name] !== 'function') {
        keys.push(name);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error accessing property ${name}`, error);
    }
  }

  return keys;
}
