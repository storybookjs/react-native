import { Router } from '@storybook/components';
import toId from '../libs/id';

// Initialize the state based on the URL.
// NOTE:
//   Although we don't change the URL when you change the state, we do support setting inital state
//   via the following URL parameters:
//     - full: 0/1 -- show fullscreen
//     - panel: bottom/right/0 -- set addons panel position (or hide)
//     - nav: 0/1 -- show or hide the story list
//
//   We also support legacy URLs from storybook <5
const initialUrlSupport = ({ location, path }, navigate) => {
  const addition = {};
  const query = Router.parseQuery(location);
  let selectedPanel;

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

  // Legacy URLs
  if (query.addons === '0') {
    addition.showPanel = false;
  }
  if (query.panelRight === '1') {
    addition.panelPosition = 'right';
  }
  if (query.stories === '0') {
    addition.showNav = false;
  }

  if (query.addonPanel) {
    selectedPanel = query.addonPanel;
  }

  if (query.selectedKind && query.selectedStory) {
    const storyId = toId(query.selectedKind, query.selectedStory);
    setTimeout(() => navigate(`/components/${storyId}`, { replace: true }), 1);
  } else if (!query.path || query.path === '/') {
    setTimeout(() => navigate(`/components/*`, { replace: true }), 1);
  } else if (Object.keys(query).length > 1) {
    // remove other queries
    setTimeout(() => navigate(`/${query.path}`, { replace: true }), 1);
  }

  return { layout: addition, selectedPanel, location, path };
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
      const { path, viewMode, storyId, url } = store.getState();
      const queryParams = api.getQueryParam();

      return {
        queryParams,
        path,
        viewMode,
        storyId,
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

  return { api, state: initialUrlSupport({ location, path: initialPath }, navigate) };
}
