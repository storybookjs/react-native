import fuzzysearch from 'fuzzysearch';

export function storyFilter(stories, filter, selectedKind) {
  if (!stories) return null;
  if (!filter) return stories;

  return stories.filter((kindInfo) => {
    if (kindInfo.kind === selectedKind) return true;
    const needle = filter.toLocaleLowerCase();
    const hstack = kindInfo.kind.toLocaleLowerCase();
    return fuzzysearch(needle, hstack);
  });
}
