import { types } from '@storybook/addons';

export function ensurePanel(panels, selectedPanel, currentPanel) {
  const keys = Object.keys(panels);

  if (keys.indexOf(selectedPanel) >= 0) {
    return selectedPanel;
  }

  if (keys.length) {
    return keys[0];
  }
  return currentPanel;
}

export default function initPanels({ store, provider }) {
  // getters
  function getPanels() {
    return provider.getElements(types.PANEL);
  }

  function getSelectedPanel() {
    const { selectedPanel } = store.getState();
    const panels = getPanels();
    return ensurePanel(panels, selectedPanel, selectedPanel);
  }

  function setSelectPanel(panelName) {
    store.setState({ selectedPanel: panelName });
  }

  return {
    getSelectedPanel,
    getPanels,
    setSelectPanel,
  };
}
