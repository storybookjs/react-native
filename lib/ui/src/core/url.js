import qs from 'qs';

import { Router } from '@storybook/components';

const legacyUrlSupport = ({ location, path }, navigate) => {
  const addition = {};
  const query = Router.parseQuery(location);

  if (query.full === '1') {
    addition.isFullscreen = true;
  }
  if (query.panel) {
    if (['right', 'bottom'].includes(query.panel)) {
      addition.panelPosition = query.panel;
    } else if (query.panel === '0') {
      addition.showPanel = false;
    }
  }
  if (query.nav === '0') {
    addition.showNav = false;
  }

  if (!query.path || query.path === '/') {
    setTimeout(() => navigate(`/components/*`, { replace: true }), 1);
  } else if (Object.keys(query).length > 1) {
    // remove other queries
    setTimeout(() => navigate(`/${query.path}`, { replace: true }), 1);
  }

  return { layout: addition, location, path };
};

export default function({ store, navigate, location, path }) {
  const api = {
    getQueryParam: key => {
      const { customQueryParams } = store.getState();
      if (customQueryParams) {
        return customQueryParams[key];
      }
      return undefined;
    },
    getUrlState: overrideParams => {
      const params = api.getUrlState();
      const url = qs.stringify(
        {
          ...params,
          ...overrideParams,
        },
        { encode: false, addQueryPrefix: true }
      );

      return {
        ...params,
        url,
      };
    },
    setQueryParams(input) {
      const { customQueryParams } = store.getState();
      store.setState({
        customQueryParams: {
          ...customQueryParams,
          ...Object.keys(input).reduce((acc, key) => {
            if (input[key] !== null) {
              acc[key] = input[key];
            }
            return acc;
          }, {}),
        },
      });
    },
  };

  return { api, state: legacyUrlSupport({ location, path }, navigate) };
}
