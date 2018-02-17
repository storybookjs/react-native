import Fuse from 'fuse.js';
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
      rootName: item.rootName,
      namespaces: item.namespaces,
      storyName: story,
    }));

    return arr.concat(flatten);
  }, []);
}

function applySearchHookForSelectedKind(stories, filter, selectedKind, selectedStory) {
  return stories.map(story => {
    if (story.kind === selectedKind && story.storyName === selectedStory) {
      return {
        ...story,
        searchHook: filter,
      };
    }

    return story;
  });
}

function getGroupedStoryItem(map, item, matches) {
  let storyItem = map.get(item.kind);

  if (!storyItem) {
    storyItem = {
      kind: item.kind,
      rootName: item.rootName,
      namespaces: item.namespaces,
      stories: [],
      matches: matches.filter(match => match.key === 'namespaces'),
    };

    map.set(item.kind, storyItem);
  }

  return storyItem;
}

function appendStoryMatch(item, matches) {
  const storyMatch = matches.find(match => match.key === 'storyName');

  if (storyMatch) {
    item.matches.push({
      indices: storyMatch.indices,
      value: storyMatch.value,
      key: 'stories',
    });
  }
}

function groupStories(matchedItems) {
  const storiesMap = matchedItems.reduce((map, matchedItem) => {
    const { item, matches } = matchedItem;
    const groupedStoryItem = getGroupedStoryItem(map, item, matches);

    groupedStoryItem.stories.push(item.storyName);
    appendStoryMatch(groupedStoryItem, matches);

    return map;
  }, new Map());

  return Array.from(storiesMap.values());
}

export function storyFilter(stories, filter, selectedKind, selectedStory, sortStoriesByKind) {
  if (!stories) {
    return null;
  }

  const sorted = sort(stories, sortStoriesByKind);

  if (!filter) {
    return sorted;
  }

  const flattened = flattenStories(sorted);

  const storiesWithHook = applySearchHookForSelectedKind(
    flattened,
    filter,
    selectedKind,
    selectedStory
  );

  const fuse = new Fuse(storiesWithHook, searchOptions);
  const foundStories = fuse.search(filter);

  return groupStories(foundStories);
}
