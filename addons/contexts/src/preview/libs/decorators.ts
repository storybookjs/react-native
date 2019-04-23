/**
 * Memorize the calculated result of a function by an ES6 Map;
 * the default is to memorize its the first argument;
 * @return the memorized version of a function.
 */
type Memorize = <T, U extends any[]>(
  fn: (...args: U) => T,
  resolver?: (...args: U) => unknown
) => (...args: U) => T;

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
type Singleton = <T, U extends any[]>(fn: (...args: U) => T) => (...args: U) => T;

export const singleton: Singleton = fn => memorize(fn, () => 'singleton');
