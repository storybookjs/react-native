import { themes } from '@storybook/theming';

import merge from '../libs/merge';

const initial = {
  ui: {
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
  storiesConfigured: false,
};

// Returns the initialState of the app
export default (...additions) => additions.reduce((acc, item) => merge(acc, item), initial);
