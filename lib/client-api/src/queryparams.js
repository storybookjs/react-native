import { document } from 'global';
import qs from 'qs';

export const getQueryParams = () => {
  return qs.parse(document.location.search, { ignoreQueryPrefix: true });
};

export const getQueryParam = key => {
  const params = getQueryParams();
  return params[key];
};
