import { decycle } from '../index';

export default function prepareArguments(arg) {
  try {
    return JSON.stringify(decycle(arg));
  } catch (error) {
    return error.toString(); // IE still cyclic.
  }
}
