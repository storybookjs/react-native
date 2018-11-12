export default function({ store }) {
  return {
    toggleFullscreen(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.ui.isFullscreen;

        return {
          ui: {
            ...state.ui,
            isFullscreen: value,
          },
        };
      });
    },

    togglePanel(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.ui.showPanel;

        return {
          ui: {
            ...state.ui,
            showPanel: value,
          },
        };
      });
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
          panelPosition: state.ui.panelPosition === 'right' ? 'bottom' : 'right',
        },
      }));
    },

    toggleNav(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.ui.showNav;

        return {
          ui: {
            ...state.ui,
            showNav: value,
          },
        };
      });
    },

    toggleToolbar(toggled) {
      return store.setState(state => {
        const value = typeof toggled !== 'undefined' ? toggled : !state.ui.isToolshown;

        return {
          ui: {
            ...state.ui,
            isToolshown: value,
          },
        };
      });
    },
  };
}
