import fuzzysearch from 'fuzzysearch';
import Fuse from '@hypnosphi/fuse.js';
import sortBy from 'lodash.sortby';

const searchOptions = {
  shouldSort: false,
  tokenize: false,
  matchAllTokens: false,
  includeScore: true,
  includeMatches: true,
  findAllMatches: true,
  threshold: 0.2,
  location: 0,
  distance: 200,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['namespaces', 'stories', 'searchHook'],
};

function sort(stories, sortStoriesByKind) {
  if (!sortStoriesByKind) return stories;

  return sortBy(stories, ['kind']);
}

export function storyFilter2(stories, filter, selectedKind, sortStoriesByKind) {
  if (!stories) return null;
  const sorted = sort(stories, sortStoriesByKind);
  if (!filter) return sorted;

  return sorted.reduce((acc, kindInfo) => {
    // Don't filter out currently selected filter
    if (kindInfo.kind === selectedKind) return acc.concat(kindInfo);
    const needle = filter.toLocaleLowerCase();
    const hstack = kindInfo.kind.toLocaleLowerCase();

    // If a match is found in the story hierachy structure return kindInfo
    if (fuzzysearch(needle, hstack)) return acc.concat(kindInfo);

    // Now search at individual story level and filter results
    const matchedStories = kindInfo.stories.filter(story => {
      const storyHstack = story.toLocaleLowerCase();
      return fuzzysearch(needle, storyHstack);
    });

    if (matchedStories.length)
      return acc.concat({
        kind: kindInfo.kind,
        stories: matchedStories,
      });

    return acc;
  }, []);
}

function applySearchHookForSelectedKind(stories, filter, selectedKind) {
  return stories.map(story => {
    if (story.kind !== selectedKind) {
      return story;
    }

    return {
      ...story,
      searchHook: filter,
    };
  });
}

export function storyFilter(stories, filter, selectedKind, sortStoriesByKind) {
  if (!stories) {
    return null;
  }

  const sorted = sort(stories, sortStoriesByKind);

  if (!filter) {
    return sorted;
  }

  const mapped = applySearchHookForSelectedKind(sorted, filter, selectedKind);

  const fuse = new Fuse(mapped, searchOptions);

  return fuse.search(filter);
}
