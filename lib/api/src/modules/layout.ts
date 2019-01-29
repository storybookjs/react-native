import { Module } from '../index';

export default function({ store }: Module) {
  const api = {
    toggleFullscreen(toggled?: boolean) {
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

    togglePanel(toggled?: boolean) {
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

    togglePanelPosition(position?: 'bottom' | 'right') {
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

    toggleNav(toggled?: boolean) {
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

    toggleToolbar(toggled?: boolean) {
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
  };

  return { api };
}
