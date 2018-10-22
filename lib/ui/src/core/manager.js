import pick from 'lodash.pick';
import { themes } from '@storybook/components';

import initPanels, { ensurePanel } from './panels';
import initStories from './stories';

// simple store implementation
const createStore = initialState => {
  let state = initialState;
  const listeners = [];

  function notify() {
    listeners.forEach(l => l());
  }

  function setState(patch) {
    console.log('previousState: ', state);
    if (typeof patch === 'function') {
      state = { ...state, ...patch(state) };
    } else {
      state = { ...state, ...patch };
    }
    console.log('nextState: ', state);
    notify();
  }

  return {
    getState() {
      return state;
    },
    setState,
    subscribe(listener) {
      listeners.push(listener);
      return function unsubscribe(l) {
        listeners.splice(listeners.indexOf(l), 1);
      };
    },
  };
};

// app state manager
const createManager = ({ history, provider }) => {
  const store = createStore({
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

  // ctx to pass to all managers
  const ctx = {
    store,
    history,
    provider,
  };

  return {
    store,
    toggleFullscreen(toggled) {
      if (typeof toggled !== 'undefined') {
        return store.setState(state => ({
          ui: {
            ...state.ui,
            isFullscreen: toggled,
          },
        }));
      }

      return store.setState(state => ({
        ui: {
          ...state.ui,
          isFullscreen: !state.ui.isFullscreen,
        },
      }));
    },

    togglePanel(toggled) {
      if (typeof toggled !== 'undefined') {
        return store.setState(state => ({
          ui: {
            ...state.ui,
            showPanel: toggled,
          },
        }));
      }

      return store.setState(state => ({
        ui: {
          ...state.ui,
          showPanel: !state.ui.showPanel,
        },
      }));
    },

    togglePanelPosition(position) {
      if (typeof position !== 'undefined') {
        return store.setState(state => ({
          ui: {
            ...state.ui,
            panelPosition: position,
          },
        }));
      }

      return store.setState(state => ({
        ui: {
          ...state.ui,
          panelPosition: !state.ui.panelPosition,
        },
      }));
    },

    toggleNav(toggled) {
      if (typeof toggled !== 'undefined') {
        return store.setState(state => ({
          ui: {
            ...state.ui,
            showNav: toggled,
          },
        }));
      }

      return store.setState(state => ({
        ui: {
          ...state.ui,
          showNav: !state.ui.showNav,
        },
      }));
    },
    getChannel() {
      return provider.channel;
    },
    getElements(type) {
      return provider.getElements(type);
    },
    setOptions(changes) {
      const { uiOptions: oldOptions, selectedPanel, panels } = store.getState();
      const { newSelectedPanel } = changes;
      const options = pick(changes, Object.keys(oldOptions));

      store.setState({
        uiOptions: {
          ...oldOptions,
          ...options,
        },
      });

      if (newSelectedPanel && newSelectedPanel !== selectedPanel) {
        store.setState({
          selectedPanel: ensurePanel(panels, newSelectedPanel, selectedPanel),
        });
      }
    },
    setShortcutsOptions(options) {
      const { shortcutOptions } = store.getState();

      store.setState({
        shortcutOptions: {
          ...shortcutOptions,
          ...pick(options, Object.keys(shortcutOptions)),
        },
      });
    },
    setQueryParams(customQueryParams) {
      const state = store.getState();
      store.setState({
        customQueryParams: {
          ...state.customQueryParams,
          ...Object.keys(customQueryParams).reduce((acc, key) => {
            if (customQueryParams[key] !== null) acc[key] = customQueryParams[key];
            return acc;
          }, {}),
        },
      });
    },
    ...initPanels(ctx),
    ...initStories(ctx),
  };
};

export default createManager;
