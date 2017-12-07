import createFunction from '../function/createFunction';

export default function createFakeConstructor(obj, key) {
  const Func = createFunction(obj[key]);
  const func = new Func();

  delete obj[key]; // eslint-disable-line no-param-reassign

  Object.assign(func, obj);

  return func;
}
