export default function createFakeConstructor(obj, key) {
  function FakeConstructor(data) {
    Object.assign(this, data);
  }

  Object.defineProperty(FakeConstructor, 'name', {
    value: obj[key],
  });

  delete obj[key]; // eslint-disable-line no-param-reassign

  return new FakeConstructor(obj);
}
