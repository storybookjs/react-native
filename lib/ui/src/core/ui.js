export default function({ store }) {
  return {
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
          panelPosition: state.ui.panelPosition === 'right' ? 'bottom' : 'right',
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
  };
}
