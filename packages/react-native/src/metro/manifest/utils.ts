import { readFileSync } from 'node:fs';
import { resolveImport } from 'storybook/internal/common';
import * as find from 'empathic/find';

export const groupBy = <K extends PropertyKey, T>(
  items: T[],
  keySelector: (item: T, index: number) => K
) => {
  return items.reduce<Partial<Record<K, T[]>>>((acc = {}, item, index) => {
    const key = keySelector(item, index);
    if (!Array.isArray(acc[key])) {
      acc[key] = [];
    }
    acc[key]!.push(item);
    return acc;
  }, {});
};

export function invariant(
  condition: unknown,
  message?: string | (() => string)
): asserts condition {
  if (condition) {
    return;
  }
  throw new Error((typeof message === 'function' ? message() : message) ?? 'Invariant failed');
}

let memoStore: WeakMap<(...args: any[]) => any, Map<string, unknown>> = new WeakMap();

export const cached = <A extends unknown[], R>(
  fn: (...args: A) => R,
  opts: { key?: (...args: A) => string; name?: string } = {}
): ((...args: A) => R) => {
  const keyOf: (...args: A) => string =
    opts.key ??
    ((...args: A) => {
      try {
        return JSON.stringify(args);
      } catch {
        return String(args[0]);
      }
    });

  return (...args: A) => {
    const k = keyOf(...args);

    let store = memoStore.get(fn);
    if (!store) {
      store = new Map<string, unknown>();
      memoStore.set(fn, store);
    }

    if (store.has(k)) {
      return store.get(k) as R;
    }

    const result = fn(...args);
    store.set(k, result as unknown);
    return result;
  };
};

export const invalidateCache = () => {
  memoStore = new WeakMap();
};

export const cachedReadFileSync = cached(readFileSync, { name: 'cachedReadFile' });

export const cachedFindUp = cached(find.up, { name: 'findUp' });

export const cachedResolveImport: any = cached(resolveImport, { name: 'resolveImport' });

export const findTsconfigPath = cached(
  (cwd: string): string | undefined => {
    return find.up('tsconfig.json', { cwd });
  },
  { name: 'findTsconfigPath' }
);
