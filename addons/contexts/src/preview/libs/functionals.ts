import { Memorize, Singleton } from '../../@types/';

/**
 * Memorizes the calculated result of a function by an ES6 Map;
 * the default is to memorize its the first argument;
 * @return the memorized version of a function.
 */
export const memorize: Memorize = (fn, resolver) => {
  const memo = new Map();
  return (...arg) => {
    const key = resolver ? resolver(...arg) : arg[0];
    return memo.get(key) || memo.set(key, fn(...arg)).get(key);
  };
};

/**
 * Enforce a given function can only be executed once;
 * the returned value is cached for resolving the subsequent calls.
 * @return the singleton version of a function.
 */
export const singleton: Singleton = fn => memorize(fn, () => 'singleton');
