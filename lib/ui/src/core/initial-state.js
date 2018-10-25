import { themes } from '@storybook/components';

// Returns the initialState of the app
export default () => ({
  stories: [],
  storiesHash: {},
  selectedId: null,
  shortcutOptions: {
    full: false,
    nav: true,
    panel: 'right',
    enableShortcuts: true,
  },
  uiOptions: {
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
    sortStoriesByKind: false,
    sidebarAnimations: true,
    theme: themes.normal,
  },
  ui: {
    isFullscreen: false,
    showPanel: true,
    showNav: true,
    panelPosition: 'bottom',
  },
  customQueryParams: {},
  notifications: [
    {
      id: 'update',
      level: 2,
      link: '/settings/about',
      icon: '🎉',
      content: `There's a new version available: 4.0.0`,
    },
  ],

  selectedPanelValue: null,
});
