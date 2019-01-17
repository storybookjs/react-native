import qs from 'qs';
import memoize from 'memoizerific';

interface StoryData {
  viewMode?: string;
  storyId?: string;
}

const knownViewModesRegex = /(story|info)/;
const splitPath = /\/([^/]+)\/([^/]+)?/;

export const storyDataFromString: (path: string) => StoryData = memoize(1000)((path: string | undefined | null) => {
  const result: StoryData = {
    viewMode: undefined,
    storyId: undefined,
  };

  if (path) {
    const [, viewMode, storyId] = path.match(splitPath) || [undefined, undefined, undefined];
    if (viewMode && viewMode.match(knownViewModesRegex)) {
      Object.assign(result, {
        viewMode,
        storyId,
      });
    }
  }
  return result;
});

export const queryFromString = memoize(1000)(s => qs.parse(s, { ignoreQueryPrefix: true }));
export const queryFromLocation = (location: { search: string }) => queryFromString(location.search);
export const stringifyQuery = (query: object) => qs.stringify(query, { addQueryPrefix: true, encode: false });

export const getMatch = memoize(1000)((current: string, target: string, startsWith: boolean = true) => {
  const startsWithTarget = current && startsWith && current.startsWith(target);
  const currentIsTarget = typeof target === 'string' && current === target;
  const matchTarget = current && target && current.match(target);

  if (startsWithTarget || currentIsTarget || matchTarget) {
    return { path: current };
  }
  return null;
});
