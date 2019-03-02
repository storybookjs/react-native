import pick from 'lodash.pick';

import deprecate from 'util-deprecate';

import { create, themes } from '@storybook/theming';
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

const applyDeprecatedThemeOptions = deprecate(({ name, url, theme }) => {
  const vars = {
    brandTitle: name,
    brandUrl: url,
    brandImage: null,
  };

  return { theme: create(vars, theme) };
}, deprecationMessage(deprecatedThemeOptions));

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
      const { layout, ui, selectedPanel } = store.getState();

      if (options) {
        const updatedLayout = {
          ...layout,
          ...pick(options, Object.keys(layout)),
          ...checkDeprecatedLayoutOptions(options),
        };

        const updatedUi = {
          ...ui,
          ...pick(options, Object.keys(ui)),
          ...checkDeprecatedThemeOptions(options),
        };

        store.setState(
          {
            layout: updatedLayout,
            ui: updatedUi,
            selectedPanel: options.panel || options.selectedPanel || selectedPanel,
          },
          { persistence: 'permanent' }
        );
      }
    },
  };

  const fromState = pick(store.getState(), 'layout', 'ui', 'selectedPanel');

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
  };

  const state = merge(fromState, initial);

  return { api, state };
}
