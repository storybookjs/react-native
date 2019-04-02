import { history, document } from 'global';
import qs from 'qs';
import { toId } from '@storybook/router/utils';

export function pathToId(path) {
  const match = (path || '').match(/^\/story\/(.+)/);
  if (!match) {
    throw new Error(`Invalid path '${path}',  must start with '/story/'`);
  }
  return match[1];
}

export const setPath = ({ storyId }) => {
  const { path, selectedKind, selectedStory, ...rest } = qs.parse(document.location.search, {
    ignoreQueryPrefix: true,
  });
  const newPath = `${document.location.pathname}?${qs.stringify({ ...rest, id: storyId })}`;
  history.replaceState({}, '', newPath);
};

export const getIdFromLegacyQuery = ({ path, selectedKind, selectedStory }) =>
  (path && pathToId(path)) || (selectedKind && selectedStory && toId(selectedKind, selectedStory));

export const parseQueryParameters = search => {
  const { id } = qs.parse(search, { ignoreQueryPrefix: true });
  return id;
};

export const initializePath = () => {
  const query = qs.parse(document.location.search, { ignoreQueryPrefix: true });
  let { id: storyId } = query;
  if (!storyId) {
    storyId = getIdFromLegacyQuery(query);
    if (storyId) {
      setPath({ storyId });
    }
  }
  return { storyId };
};
