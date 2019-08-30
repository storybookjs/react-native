import qs from 'qs';
import memoize from 'memoizerific';
import startCase from 'lodash/startCase';

interface StoryData {
  viewMode?: string;
  storyId?: string;
}

interface SeparatorOptions {
  rootSeparator: string | RegExp;
  groupSeparator: string | RegExp;
}

const splitPathRegex = /\/([^/]+)\/([^/]+)?/;

// Remove punctuation https://gist.github.com/davidjrice/9d2af51100e41c6c4b4a
export const sanitize = (string: string) => {
  return (
    string
      .toLowerCase()
      // eslint-disable-next-line no-useless-escape
      .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  );
};

const sanitizeSafe = (string: string, part: string) => {
  const sanitized = sanitize(string);
  if (sanitized === '') {
    throw new Error(`Invalid ${part} '${string}', must include alphanumeric characters`);
  }
  return sanitized;
};

export const toId = (kind: string, name: string) =>
  `${sanitizeSafe(kind, 'kind')}--${sanitizeSafe(name, 'name')}`;

export const parsePath: (path?: string) => StoryData = memoize(1000)(
  (path: string | undefined | null) => {
    const result: StoryData = {
      viewMode: undefined,
      storyId: undefined,
    };

    if (path) {
      const [, viewMode, storyId] = path.match(splitPathRegex) || [undefined, undefined, undefined];
      if (viewMode) {
        Object.assign(result, {
          viewMode,
          storyId,
        });
      }
    }
    return result;
  }
);

interface Query {
  [key: string]: any;
}

export const queryFromString = memoize(1000)(
  (s: string): Query => qs.parse(s, { ignoreQueryPrefix: true })
);
export const queryFromLocation = (location: { search: string }) => queryFromString(location.search);
export const stringifyQuery = (query: Query) =>
  qs.stringify(query, { addQueryPrefix: true, encode: false });

export const getMatch = memoize(1000)(
  (current: string, target: string, startsWith: boolean = true) => {
    const startsWithTarget = current && startsWith && current.startsWith(target);
    const currentIsTarget = typeof target === 'string' && current === target;
    const matchTarget = current && target && current.match(target);

    if (startsWithTarget || currentIsTarget || matchTarget) {
      return { path: current };
    }
    return null;
  }
);

export const parseKind = (kind: string, { rootSeparator, groupSeparator }: SeparatorOptions) => {
  const [root, remainder] = kind.split(rootSeparator, 2);
  const groups = (remainder || kind).split(groupSeparator).filter(i => !!i);

  // when there's no remainder, it means the root wasn't found/split
  return {
    root: remainder ? root : null,
    groups,
  };
};

// Transform the CSF named export into a readable story name
export const storyNameFromExport = (key: string) => startCase(key);
