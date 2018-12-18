import mergeWith from 'lodash.mergewith';
import isEqual from 'lodash.isequal';

import { logger } from '@storybook/client-logger';
import { themes } from '@storybook/components';

import { initShortcutKeys, serializedLocalStorage } from '../settings/utils';

const shortcuts = initShortcutKeys();

const initial = {
  shortcutKeys: serializedLocalStorage(shortcuts),
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
  notifications: [
    {
      id: 'update',
      level: 2,
      link: '/settings/about',
      icon: '🎉',
      content: `There's a new version available: 4.0.0`,
    },
  ],
};

const merge = (a, b) =>
  mergeWith(a, b, (objValue, srcValue) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      logger.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });

// Returns the initialState of the app
export default (...additions) => additions.reduce((acc, item) => merge(acc, item), initial);
