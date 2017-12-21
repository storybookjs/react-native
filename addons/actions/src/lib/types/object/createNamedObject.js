import createFunction from '../function/createFunction';

export default function createNamedObject(obj, key) {
  const Func = createFunction(obj[key]);
  const namedObj = new Func();

  delete obj[key]; // eslint-disable-line no-param-reassign

  Object.assign(namedObj, obj);

  return namedObj;
}
