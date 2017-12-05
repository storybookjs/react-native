/* eslint-disable no-new-func */
export default function createFunction(name = '') {
  return new Function(`return function ${name}() {}`)();
}
