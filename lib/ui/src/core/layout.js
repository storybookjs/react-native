import pick from 'lodash.pick';

import deprecate from 'util-deprecate';
import deepEqual from 'fast-deep-equal';

import { themes } from '@storybook/theming';
import merge from '../libs/merge';

const deprecatedThemeOptions = {
  name: 'brandTitle',
  url: 'brandUrl',
};

const deprecatedLayoutOptions = {
  goFullScreen: 'isFullscreen',
  showStoriesPanel: 'showNav',
  showAddonPanel: 'showPanel',
  addonPanelInRight: 'panelPosition',
};

const deprecationMessage = (optionsMap, prefix) =>
  `The options { ${Object.keys(optionsMap).join(', ')} } are deprecated -- use ${
    prefix ? `${prefix}'s` : ''
  } { ${Object.values(optionsMap).join(', ')} } instead.`;

const applyDeprecatedThemeOptions = deprecate(
  ({ name, url }) => ({
    brandTitle: name,
    brandUrl: url,
    brandImage: null,
  }),
  deprecationMessage(deprecatedThemeOptions)
);

const applyDeprecatedLayoutOptions = deprecate(options => {
  const layoutUpdate = {};

  ['goFullScreen', 'showStoriesPanel', 'showAddonPanel'].forEach(option => {
    if (typeof options[option] !== 'undefined') {
      layoutUpdate[deprecatedLayoutOptions[option]] = options[option];
    }
  });
  if (options.addonPanelInRight) {
    layoutUpdate.panelPosition = 'right';
  }
  return layoutUpdate;
}, deprecationMessage(deprecatedLayoutOptions));

const checkDeprecatedThemeOptions = options => {
  if (Object.keys(deprecatedThemeOptions).find(key => !!options[key])) {
    return applyDeprecatedThemeOptions(options);
  }
  return {};
};

const checkDeprecatedLayoutOptions = options => {
  if (Object.keys(deprecatedLayoutOptions).find(key => typeof options[key] !== 'undefined')) {
    return applyDeprecatedLayoutOptions(options);
  }
  return {};
};

const initial = {
  ui: {
    enableShortcuts: true,
    sortStoriesByKind: false,
    sidebarAnimations: true,
  },
  layout: {
    isToolshown: true,
    isFullscreen: false,
    showPanel: true,
    showNav: true,
    panelPosition: 'bottom',
  },
  theme: themes.light,
};

let hasSetOptions = false;
export default function({ store }) {
  const api = {
    toggleFullscreen(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.isFullscreen;

        return {
          layout: {
            ...state.layout,
            isFullscreen: value,
          },
        };
      });
    },

    togglePanel(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.showPanel;

        return {
          layout: {
            ...state.layout,
            showPanel: value,
          },
        };
      });
    },

    togglePanelPosition(position) {
      if (typeof position !== 'undefined') {
        return store.setState(state => ({
          layout: {
            ...state.layout,
            panelPosition: position,
          },
        }));
      }

      return store.setState(state => ({
        layout: {
          ...state.layout,
          panelPosition: state.layout.panelPosition === 'right' ? 'bottom' : 'right',
        },
      }));
    },

    toggleNav(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.showNav;

        return {
          layout: {
            ...state.layout,
            showNav: value,
          },
        };
      });
    },

    toggleToolbar(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.isToolshown;

        return {
          layout: {
            ...state.layout,
            isToolshown: value,
          },
        };
      });
    },

    setOptions: options => {
      // The very first time the user sets their options, we don't consider what is in the store.
      // At this point in time, what is in the store is what we *persisted*. We did that in order
      // to avoid a FOUC (e.g. initial rendering the wrong theme while we waited for the stories to load)
      // However, we don't want to have a memory about these things, otherwise we see bugs like the
      // user setting a name for their storybook, persisting it, then never being able to unset it
      // without clearing localstorage. See https://github.com/storybooks/storybook/issues/5857
      const { layout, ui, selectedPanel, theme } = hasSetOptions ? store.getState() : initial;

      if (options) {
        const updatedLayout = {
          ...layout,
          ...pick(options, Object.keys(layout)),
          ...checkDeprecatedLayoutOptions(options),
        };

        const updatedUi = {
          ...ui,
          ...pick(options, Object.keys(ui)),
        };

        const updatedTheme = {
          ...theme,
          ...options.theme,
          ...checkDeprecatedThemeOptions(options),
        };

        const modification = {};

        if (!deepEqual(ui, updatedUi)) {
          modification.ui = updatedUi;
        }
        if (!deepEqual(layout, updatedLayout)) {
          modification.layout = updatedLayout;
        }
        if (!deepEqual(theme, updatedTheme)) {
          modification.theme = updatedTheme;
        }
        if (!deepEqual(selectedPanel, options.selectedPanel)) {
          modification.selectedPanel = options.selectedPanel;
        }

        if (Object.keys(modification).length) {
          store.setState(modification, { persistence: 'permanent' });
        }

        hasSetOptions = true;
      }
    },
  };

  const persisted = pick(store.getState(), 'layout', 'ui', 'selectedPanel', 'theme');
  const state = merge(initial, persisted);

  return { api, state };
}
