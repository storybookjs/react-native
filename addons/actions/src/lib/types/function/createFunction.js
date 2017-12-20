import canConfigureName from '../../util/canConfigureName';
import createFunctionEval from './createFunctionEval';

export default function createFunction(name = '') {
  if (canConfigureName) {
    const func = function unnamed() {};

    Object.defineProperty(func, 'name', { value: name });

    return func;
  }

  return createFunctionEval(name);
}
