import { queryFromLocation } from '@storybook/router';
import { toId } from '@storybook/router/dist/utils';

import { Module } from '../index';
import { PanelPositions } from './layout';

interface Additions {
  isFullscreen?: boolean;
  showPanel?: boolean;
  panelPosition?: PanelPositions;
  showNav?: boolean;
  selectedPanel?: string;
}

// Initialize the state based on the URL.
// NOTE:
//   Although we don't change the URL when you change the state, we do support setting inital state
//   via the following URL parameters:
//     - full: 0/1 -- show fullscreen
//     - panel: bottom/right/0 -- set addons panel position (or hide)
//     - nav: 0/1 -- show or hide the story list
//
//   We also support legacy URLs from storybook <5
const initialUrlSupport = ({ navigate, location, path }: Module) => {
  const addition: Additions = {};
  const query = queryFromLocation(location);
  let selectedPanel;

  const {
    full,
    panel,
    nav,
    addons,
    panelRight,
    stories,
    addonPanel,
    selectedKind,
    selectedStory,
    path: queryPath,
    ...customQueryParams
  } = query;

  if (full === '1') {
    addition.isFullscreen = true;
  }
  if (panel) {
    if (['right', 'bottom'].includes(panel)) {
      addition.panelPosition = panel;
    } else if (panel === '0') {
      addition.showPanel = false;
    }
  }
  if (nav === '0') {
    addition.showNav = false;
  }

  // Legacy URLs
  if (addons === '0') {
    addition.showPanel = false;
  }
  if (panelRight === '1') {
    addition.panelPosition = 'right';
  }
  if (stories === '0') {
    addition.showNav = false;
  }

  if (addonPanel) {
    selectedPanel = addonPanel;
  }

  if (selectedKind && selectedStory) {
    const storyId = toId(selectedKind, selectedStory);
    setTimeout(() => navigate(`/story/${storyId}`, { replace: true }), 1);
  } else if (!queryPath || queryPath === '/') {
    setTimeout(() => navigate(`/story/*`, { replace: true }), 1);
  } else if (Object.keys(query).length > 1) {
    // remove other queries
    setTimeout(() => navigate(`${queryPath}`, { replace: true }), 1);
  }

  return { layout: addition, selectedPanel, location, path, customQueryParams };
};

export interface QueryParams {
  [key: string]: string;
}

export interface SubAPI {
  getQueryParam: (key: string) => string | undefined;
  getUrlState: () => {
    queryParams: QueryParams;
    path: string;
    viewMode?: string;
    storyId?: string;
    url: string;
  };
  setQueryParams: (input: QueryParams) => void;
}

export default function({ store, navigate, location, path: initialPath, ...rest }: Module) {
  const api: SubAPI = {
    getQueryParam: key => {
      const { customQueryParams } = store.getState();
      if (customQueryParams) {
        return customQueryParams[key];
      }
      return undefined;
    },
    getUrlState: () => {
      const { path, viewMode, storyId, url, customQueryParams } = store.getState();
      const queryParams = customQueryParams;

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
      const queryParams: QueryParams = {};
      store.setState({
        customQueryParams: {
          ...customQueryParams,
          ...Object.entries(input).reduce((acc, [key, value]) => {
            if (value !== null) {
              acc[key] = value;
            }
            return acc;
          }, queryParams),
        },
      });
    },
  };

  return {
    api,
    state: initialUrlSupport({ store, navigate, location, path: initialPath, ...rest }),
  };
}
