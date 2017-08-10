import Fuse from '@hypnosphi/fuse.js';
import sortBy from 'lodash.sortby';

const searchOptions = {
  shouldSort: false,
  tokenize: false,
  matchAllTokens: false,
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

function isMatched(matches, type, value) {
  if (!matches) {
    return null;
  }

  return matches.filter(match => match.key === type).find(match => match.value === value);
}

function isKindMatched(matches, namespaces) {
  return namespaces.some(namespace => isMatched(matches, 'namespaces', namespace));
}

function isStoryMatched(matches, story) {
  return isMatched(matches, 'stories', story);
}

function isSelectedKind(storyItem, selectedKind) {
  return storyItem.kind === selectedKind;
}

function filterOutUnmatchedStories({ stories, matches }) {
  return stories.filter(story => isStoryMatched(matches, story));
}

function flattenStories(stories, selectedKind) {
  return stories.map(found => {
    const storyItem = {
      ...found.item,
      matches: found.matches,
    };

    if (isSelectedKind(storyItem, selectedKind)) {
      return storyItem;
    }

    if (isKindMatched(storyItem.matches, storyItem.namespaces)) {
      return storyItem;
    }

    storyItem.stories = filterOutUnmatchedStories(storyItem);

    return storyItem;
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

  const storiesWithHook = applySearchHookForSelectedKind(sorted, filter, selectedKind);
  const fuse = new Fuse(storiesWithHook, searchOptions);
  const foundStories = fuse.search(filter);
  return flattenStories(foundStories, selectedKind);
}
