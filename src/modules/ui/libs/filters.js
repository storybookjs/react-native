import fuzzysearch from 'fuzzysearch';
import sortBy from 'lodash.sortby';

export function storyFilter(stories, filter, selectedKind) {
  if (!stories) return null;

  const sorted = sortBy(stories, ['kind']);
  if (!filter) return sorted;

  return sorted.filter((kindInfo) => {
    if (kindInfo.kind === selectedKind) return true;
    const needle = filter.toLocaleLowerCase();
    const hstack = kindInfo.kind.toLocaleLowerCase();
    return fuzzysearch(needle, hstack);
  });
}
