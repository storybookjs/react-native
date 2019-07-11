import { document } from 'global';
import qs from 'qs';

export const getQueryParams = () => {
  // document.location is not defined in react-native
  if (document && document.location && document.location.search) {
    return qs.parse(document.location.search, { ignoreQueryPrefix: true });
  }
  return {};
};

export const getQueryParam = (key: string): string | void => {
  const params = getQueryParams();

  return params[key];
};
