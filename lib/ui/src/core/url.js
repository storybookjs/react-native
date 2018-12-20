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

export default function({ store, navigate, location, path: initialPath }) {
  const api = {
    getQueryParam: key => {
      const { customQueryParams } = store.getState();
      if (customQueryParams) {
        return customQueryParams[key];
      }
      return undefined;
    },
    getUrlState: () => {
      const { path, viewMode, componentId, url } = store.getState();
      const queryParams = api.getQueryParam();

      return {
        queryParams,
        path,
        viewMode,
        componentId,
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

  return { api, state: legacyUrlSupport({ location, path: initialPath }, navigate) };
}
