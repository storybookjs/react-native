import globBase from 'glob-base';
import { makeRe } from 'micromatch';

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;
export const toRequireContext = input => {
  switch (true) {
    case typeof input === 'string': {
      const { base, glob } = globBase(input);
      const regex = makeRe(glob)
        .toString()
        // webpack prepends the relative path with './'
        .replace(/^\/\^/, '/^\\.\\/')
        .replace(/\?:\^/g, '?:');

      return { path: base, recursive: glob.startsWith('**'), match: regex };
    }
    case isObject(input): {
      return input;
    }

    default: {
      throw new Error('the provided input cannot be transformed into a require.context');
    }
  }
};

export const toRequireContextString = input => {
  const { path: p, recursive: r, match: m } = toRequireContext(input);
  return `require.context('${p}', ${r}, ${m})`;
};
