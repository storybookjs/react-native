import { location } from 'global';
import merge from './lib/merge';

import { themes } from '@storybook/theming';
import { State } from './index';
import { defaultShortcuts } from './modules/shortcuts';

const initial: State = {
  layout: {
    isToolshown: true,
    isFullscreen: false,
    showPanel: true,
    showNav: true,
    panelPosition: 'bottom',
  },

  ui: {
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
    enableShortcuts: true,
    sortStoriesByKind: false,
    sidebarAnimations: true,
    theme: themes.normal,
  },

  location,
  path: '/',
  viewMode: undefined,
  storyId: undefined,

  storiesHash: {},
  shortcuts: defaultShortcuts,

  customQueryParams: {},

  notifications: [],

  versions: {
    latest: {},
    current: {},
  },
  lastVersionCheck: undefined,
  dismissedVersionNotification: undefined,
};

interface Addition {
  [key: string]: any;
}
type Additions = Addition[];

// Returns the initialState of the app
const main = (...additions: Additions): State => additions.reduce((acc: State, item) => merge(acc, item), initial);

export default main;
