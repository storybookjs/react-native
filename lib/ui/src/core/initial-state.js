import { themes } from '@storybook/theming';

import merge from '../libs/merge';

const initial = {
  ui: {
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
    enableShortcuts: true,
    sortStoriesByKind: false,
    sidebarAnimations: true,
    theme: themes.normal,
  },
  layout: {
    isToolshown: true,
    isFullscreen: false,
    showPanel: true,
    showNav: true,
    panelPosition: 'bottom',
  },
  customQueryParams: {},
};

// Returns the initialState of the app
export default (...additions) => additions.reduce((acc, item) => merge(acc, item), initial);
