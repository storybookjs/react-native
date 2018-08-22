import { observable } from 'mobx';
import { bindActions } from './utils';

const initialState = {
  isFullscreen: false,
  showPanel: true,
  showNav: true,
  panelPosition: 'bottom',
};

const actions = {
  toggleFullscreen(toggled) {
    if (typeof toggled !== 'undefined') this.isFullscreen = toggled;
    else this.isFullscreen = !this.isFullscreen;
  },

  togglePanel(toggled) {
    if (typeof toggled !== 'undefined') this.showPanel = toggled;
    else this.showPanel = !this.showPanel;
  },

  togglePanelPosition(position) {
    if (typeof position !== 'undefined') this.panelPosition = position;
    else this.panelPosition = this.panelPosition === 'bottom' ? 'right' : 'bottom';
  },

  toggleNav(toggled) {
    if (typeof toggled !== 'undefined') this.showNav = toggled;
    else this.showNav = !this.showNav;
  },
};

const createUiStore = () => {
  const store = observable(initialState);

  bindActions(store, actions);

  return store;
};

export default createUiStore;
