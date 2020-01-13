import qs from 'qs';
import memoize from 'memoizerific';
import deprecate from 'util-deprecate';

// FIXME: Remove in SB 6.0
import * as csf from '@storybook/csf';

export const { toId, parseKind, sanitize, storyNameFromExport } = {
  toId: deprecate(csf.toId, `Router util 'toId' moved to '@storybook/csf'.`),
  parseKind: deprecate(csf.parseKind, `Router util 'parseKind' moved to '@storybook/csf'.`),
  sanitize: deprecate(csf.sanitize, `Router util 'sanitize' moved to '@storybook/csf'.`),
  storyNameFromExport: deprecate(
    csf.storyNameFromExport,
    `Router util 'storyNameFromExport' moved to '@storybook/csf'.`
  ),
};

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
