import { themes } from '@storybook/components';
import { initShortcutKeys, serializedLocalStorage } from '../settings/utils';

const shortcuts = initShortcutKeys();

// Returns the initialState of the app
export default addition => ({
  stories: [],
  storiesHash: {},
  selectedId: null,
  shortcutOptions: {
    full: false,
    nav: true,
    panel: 'right',
    enableShortcuts: true,
  },
  shortcutKeys: serializedLocalStorage(shortcuts),
  uiOptions: {
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
    sortStoriesByKind: false,
    sidebarAnimations: true,
    theme: themes.normal,
  },
  ui: {
    isToolshown: true,
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

  ...addition,
});
