import { document } from 'global';
import pick from 'lodash.pick';

import deprecate from 'util-deprecate';
import deepEqual from 'fast-deep-equal';

import { themes, ThemeVars } from '@storybook/theming';
import merge from '../lib/merge';
import { State } from '../index';
import Store from '../store';

export type PanelPositions = 'bottom' | 'right';

export interface Layout {
  isFullscreen: boolean;
  showPanel: boolean;
  panelPosition: PanelPositions;
  showNav: boolean;
  isToolshown: boolean;
}

export interface UI {
  name?: string;
  url?: string;
  enableShortcuts: boolean;
  sortStoriesByKind: boolean;
  sidebarAnimations: boolean;
}

export interface SubState {
  layout: Layout;
  ui: UI;
  selectedPanel: string | undefined;
  theme: ThemeVars;
}

export interface SubAPI {
  toggleFullscreen: (toggled?: boolean) => void;
  togglePanel: (toggled?: boolean) => void;
  togglePanelPosition: (position?: PanelPositions) => void;
  toggleNav: (toggled?: boolean) => void;
  toggleToolbar: (toggled?: boolean) => void;
  setOptions: (options: any) => void;
}

type PartialSubState = Partial<SubState>;
type PartialThemeVars = Partial<ThemeVars>;
type PartialLayout = Partial<Layout>;
type PartialUI = Partial<UI>;

interface Options {
  name?: string;
  url?: string;
  goFullScreen: boolean;
  showStoriesPanel: boolean;
  showAddonPanel: boolean;
  addonPanelInRight: boolean;
  theme?: ThemeVars;
  selectedPanel?: string;
}

interface OptionsMap {
  [key: string]: string;
}

const deprecatedThemeOptions: {
  name: 'theme.brandTitle';
  url: 'theme.brandUrl';
} = {
  name: 'theme.brandTitle',
  url: 'theme.brandUrl',
};

const deprecatedLayoutOptions: {
  goFullScreen: 'isFullscreen';
  showStoriesPanel: 'showNav';
  showAddonPanel: 'showPanel';
  addonPanelInRight: 'panelPosition';
} = {
  goFullScreen: 'isFullscreen',
  showStoriesPanel: 'showNav',
  showAddonPanel: 'showPanel',
  addonPanelInRight: 'panelPosition',
};

const deprecationMessage = (optionsMap: OptionsMap, prefix: string = '') =>
  `The options { ${Object.keys(optionsMap).join(', ')} } are deprecated -- use ${
    prefix ? `${prefix}'s` : ''
  } { ${Object.values(optionsMap).join(', ')} } instead.`;

const applyDeprecatedThemeOptions = deprecate(
  ({ name, url }: Options): PartialThemeVars => ({
    brandTitle: name,
    brandUrl: url,
    brandImage: null,
  }),
  deprecationMessage(deprecatedThemeOptions)
);

const applyDeprecatedLayoutOptions = deprecate((options: Options): PartialLayout => {
  const layoutUpdate: PartialLayout = {};

  ['goFullScreen', 'showStoriesPanel', 'showAddonPanel'].forEach(
    (option: 'goFullScreen' | 'showStoriesPanel' | 'showAddonPanel') => {
      const v = options[option];
      if (typeof v !== 'undefined') {
        const key = deprecatedLayoutOptions[option];
        layoutUpdate[key] = v;
      }
    }
  );
  if (options.addonPanelInRight) {
    layoutUpdate.panelPosition = 'right';
  }
  return layoutUpdate;
}, deprecationMessage(deprecatedLayoutOptions));

const checkDeprecatedThemeOptions = (options: Options) => {
  if (Object.values(deprecatedThemeOptions).find(v => !!v)) {
    return applyDeprecatedThemeOptions(options);
  }
  return {};
};

const checkDeprecatedLayoutOptions = (options: Options) => {
  if (Object.values(deprecatedLayoutOptions).find(v => typeof v !== 'undefined')) {
    return applyDeprecatedLayoutOptions(options);
  }
  return {};
};

const initial: SubState = {
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
  selectedPanel: undefined,
  theme: themes.light,
};

export const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

let hasSetOptions = false;
export default function({ store }: { store: Store }) {
  const api = {
    toggleFullscreen(toggled?: boolean) {
      return store.setState((state: State) => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.isFullscreen;

        return {
          layout: {
            ...state.layout,
            isFullscreen: value,
          },
        };
      });
    },

    togglePanel(toggled?: boolean) {
      return store.setState((state: State) => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.showPanel;

        return {
          layout: {
            ...state.layout,
            showPanel: value,
          },
        };
      });
    },

    togglePanelPosition(position?: 'bottom' | 'right') {
      if (typeof position !== 'undefined') {
        return store.setState((state: State) => ({
          layout: {
            ...state.layout,
            panelPosition: position,
          },
        }));
      }

      return store.setState((state: State) => ({
        layout: {
          ...state.layout,
          panelPosition: state.layout.panelPosition === 'right' ? 'bottom' : 'right',
        },
      }));
    },

    toggleNav(toggled?: boolean) {
      return store.setState((state: State) => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.showNav;

        return {
          layout: {
            ...state.layout,
            showNav: value,
          },
        };
      });
    },

    toggleToolbar(toggled?: boolean) {
      return store.setState((state: State) => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.layout.isToolshown;

        return {
          layout: {
            ...state.layout,
            isToolshown: value,
          },
        };
      });
    },

    resetLayout() {
      return store.setState((state: State) => {
        return {
          layout: {
            ...state.layout,
            showNav: false,
            showPanel: false,
            isFullscreen: false,
          },
        };
      });
    },

    focusOnUIElement(elementId?: string) {
      if (!elementId) {
        return;
      }
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
      }
    },

    setOptions: (options: any) => {
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

        const modification: PartialSubState = {};

        if (!deepEqual(ui, updatedUi)) {
          modification.ui = updatedUi;
        }
        if (!deepEqual(layout, updatedLayout)) {
          modification.layout = updatedLayout;
        }
        if (!deepEqual(theme, updatedTheme)) {
          modification.theme = updatedTheme;
        }
        if (options.selectedPanel && !deepEqual(selectedPanel, options.selectedPanel)) {
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

  return { api, state: merge(initial, persisted) };
}
