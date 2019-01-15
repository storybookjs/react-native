import qs from 'qs';
import memoize from 'memoizerific';

interface StoryData {
  viewMode?: string;
  storyId?: string;
}

export const storyDataFromString: (path: string) => StoryData = memoize(1000)((path: string | undefined | null) => {
  const result: StoryData = {
    viewMode: undefined,
    storyId: undefined,
  };

  if (path) {
    const [, p1, p2] = path.match(/\/([^/]+)\/([^/]+)?/) || [undefined, undefined, undefined];
    if (p1 && p1.match(/(components|info)/)) {
      Object.assign(result, {
        viewMode: p1,
        storyId: p2,
      });
    }
  }
  return result;
});

export const queryFromString = memoize(1000)(s => qs.parse(s, { ignoreQueryPrefix: true }));
export const queryFromLocation = (location: { search: string }) => queryFromString(location.search);
export const stringifyQuery = (query: object) => qs.stringify(query, { addQueryPrefix: true, encode: false });
