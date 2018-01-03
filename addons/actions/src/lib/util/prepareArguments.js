import { decycle } from '../index';

export default function prepareArguments(arg) {
  if (arg && typeof arg.preventDefault !== 'undefined') {
    return JSON.stringify(`[${arg.constructor.name}]`);
  }

  try {
    return JSON.stringify(decycle(arg));
  } catch (error) {
    return error.toString(); // IE still cyclic.
  }
}
