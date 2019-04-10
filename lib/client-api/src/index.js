import { document } from 'global';
import qs from 'qs';
import ClientApi, { defaultDecorateStory } from './client_api';
import StoryStore, { splitPath } from './story_store';
import ConfigApi from './config_api';
import subscriptionsStore from './subscriptions_store';
import pathToId from './pathToId';

export {
  ClientApi,
  StoryStore,
  ConfigApi,
  subscriptionsStore,
  defaultDecorateStory,
  pathToId,
  splitPath,
};

export const getQueryParams = () => {
  return qs.parse(document.location.search, { ignoreQueryPrefix: true });
};

export const getQueryParam = key => {
  const params = getQueryParams();
  return params[key];
};
