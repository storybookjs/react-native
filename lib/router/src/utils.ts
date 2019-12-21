import qs from 'qs';
import memoize from 'memoizerific';

// FIXME: Remove in SB 6.0
export { toId, parseKind, sanitize } from '@storybook/csf';

interface StoryData {
  viewMode?: string;
  storyId?: string;
}

const splitPathRegex = /\/([^/]+)\/([^/]+)?/;

export const parsePath: (path?: string) => StoryData = memoize(1000)(
  (path: string | undefined | null) => {
    const result: StoryData = {
      viewMode: undefined,
      storyId: undefined,
    };

    if (path) {
      const [, viewMode, storyId] = path.toLowerCase().match(splitPathRegex) || [
        undefined,
        undefined,
        undefined,
      ];
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

export const getMatch = memoize(1000)((current: string, target: string, startsWith = true) => {
  const startsWithTarget = current && startsWith && current.startsWith(target);
  const currentIsTarget = typeof target === 'string' && current === target;
  const matchTarget = current && target && current.match(target);

  if (startsWithTarget || currentIsTarget || matchTarget) {
    return { path: current };
  }
  return null;
});
