import { history, document } from 'global';
import qs from 'qs';
import { toId } from '@storybook/csf';

export function pathToId(path) {
  const match = (path || '').match(/^\/story\/(.+)/);
  if (!match) {
    throw new Error(`Invalid path '${path}',  must start with '/story/'`);
  }
  return match[1];
}

export const setPath = ({ storyId, viewMode }) => {
  const { path, selectedKind, selectedStory, ...rest } = qs.parse(document.location.search, {
    ignoreQueryPrefix: true,
  });
  const newPath = `${document.location.pathname}?${qs.stringify({
    ...rest,
    id: storyId,
    viewMode,
  })}`;
  history.replaceState({}, '', newPath);
};

export const getIdFromLegacyQuery = ({ path, selectedKind, selectedStory }, storyStore) => {
  if (path) {
    return pathToId(path);
  }
  if (selectedKind && selectedStory) {
    // Look up the story ID inside the story store, since as of 5.3, the
    // Story ID is not necessarily a direct function of its kind/name.
    const story = storyStore.getRawStory(selectedKind, selectedStory);
    if (story) {
      return story.id;
    }
    // this will preserve existing behavior of showing a "not found" screen,
    // but the inputs will be preserved in the query param to help debugging
    return toId(selectedKind, selectedStory);
  }
  return undefined;
};

export const parseQueryParameters = search => {
  const { id } = qs.parse(search, { ignoreQueryPrefix: true });
  return id;
};

export const initializePath = storyStore => {
  const query = qs.parse(document.location.search, { ignoreQueryPrefix: true });
  let { id: storyId, viewMode } = query; // eslint-disable-line prefer-const
  if (!storyId) {
    storyId = getIdFromLegacyQuery(query, storyStore);
    if (storyId) {
      setPath({ storyId, viewMode });
    }
  }
  return { storyId, viewMode };
};
