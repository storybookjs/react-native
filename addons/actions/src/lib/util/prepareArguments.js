import { decycle } from '../index';

export default function prepareArguments(arg, depth) {
  try {
    return JSON.stringify(decycle(arg, depth));
  } catch (error) {
    return error.toString(); // IE still cyclic.
  }
}
