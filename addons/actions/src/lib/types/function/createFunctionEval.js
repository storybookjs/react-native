import isReserved from './isReserved';

export default function createFunctionEval(name) {
  const fnName = isReserved(name) ? `${name}$` : name;

  // eslint-disable-next-line no-new-func
  return new Function(`return function ${fnName}() {}`)();
}
