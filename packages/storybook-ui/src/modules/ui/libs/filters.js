import fuzzysearch from 'fuzzysearch';
import sortBy from 'lodash.sortby';

function sort(stories, sortStoriesByKind) {
  if (!sortStoriesByKind) return stories;

  return sortBy(stories, ['kind']);
}

export function storyFilter(stories, filter, selectedKind, sortStoriesByKind) {
  if (!stories) return null;
  const sorted = sort(stories, sortStoriesByKind);
  if (!filter) return sorted;

  return sorted.filter(kindInfo => {
    if (kindInfo.kind === selectedKind) return true;
    const needle = filter.toLocaleLowerCase();
    const hstack = kindInfo.kind.toLocaleLowerCase();
    return fuzzysearch(needle, hstack);
  });
}
