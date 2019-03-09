import { types, Addon, Types, Collection } from '@storybook/addons';
import { Module } from '../index';

interface Panels {
  [id: string]: Addon;
}

export interface SubAPI {
  getElements: (type: Types) => Collection;
  getPanels: () => Collection;
  getSelectedPanel: () => string;
  setSelectedPanel: (panelName: string) => void;
}

export function ensurePanel(panels: Panels, selectedPanel?: string, currentPanel?: string) {
  const keys = Object.keys(panels);

  if (keys.indexOf(selectedPanel) >= 0) {
    return selectedPanel;
  }

  if (keys.length) {
    return keys[0];
  }
  return currentPanel;
}

export default ({ provider, store }: Module) => {
  const api: SubAPI = {
    getElements: (type: Types) => provider.getElements(type),
    getPanels: () => api.getElements(types.PANEL),
    getSelectedPanel: () => {
      const { selectedPanel } = store.getState();
      return ensurePanel(api.getPanels(), selectedPanel, selectedPanel);
    },
    setSelectedPanel: (panelName: string) => {
      store.setState({ selectedPanel: panelName }, { persistence: 'session' });
    },
  };

  return {
    api,
    state: {
      selectedPanel: ensurePanel(api.getPanels(), store.getState().selectedPanel),
    },
  };
};
