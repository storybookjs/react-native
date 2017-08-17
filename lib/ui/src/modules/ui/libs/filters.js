import Fuse from '@hypnosphi/fuse.js';
import sortBy from 'lodash.sortby';

const searchOptions = {
  shouldSort: false,
  tokenize: true,
  matchAllTokens: false,
  includeMatches: true,
  findAllMatches: true,
  includeScore: false,
  threshold: 0.2,
  location: 0,
  distance: 200,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ['namespaces', 'storyName', 'searchHook'],
};

function sort(stories, sortStoriesByKind) {
  if (!sortStoriesByKind) return stories;

  return sortBy(stories, ['kind']);
}

function flattenStories(items) {
  return items.reduce((arr, item) => {
    const flatten = item.stories.map(story => ({
      kind: item.kind,
      namespaces: item.namespaces,
      storyName: story,
    }));

    return arr.concat(flatten);
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

function groupStories(matchedItems) {
  const storiesMap = matchedItems.reduce((map, matchedItem) => {
    const { item, matches } = matchedItem;
    let current = map.get(item.kind);

    if (!current) {
      current = {
        kind: item.kind,
        namespaces: item.namespaces,
        stories: [],
        matches: matches.filter(match => match.key === 'namespaces'),
      };

      map.set(item.kind, current);
    }

    current.stories.push(item.storyName);

    const storyMatch = matches.find(match => match.key === 'storyName');

    if (storyMatch) {
      current.matches.push({
        indices: storyMatch.indices,
        value: storyMatch.value,
        key: 'stories',
      });
    }

    return map;
  }, new Map());

  return Array.from(storiesMap.values());
}

export function storyFilter(stories, filter, selectedKind, sortStoriesByKind) {
  if (!stories) {
    return null;
  }

  const sorted = sort(stories, sortStoriesByKind);

  if (!filter) {
    return sorted;
  }

  const flattened = flattenStories(sorted);
  const storiesWithHook = applySearchHookForSelectedKind(flattened, filter, selectedKind);
  const fuse = new Fuse(storiesWithHook, searchOptions);
  const foundStories = fuse.search(filter);

  return groupStories(foundStories);
}
