import { inject } from 'mobx-react';
import AddonPanel from '../components/panel/panel';

export function mapper({ store, uiStore }) {
  return {
    panels: store.panels,
    selectedPanel: store.selectedPanel,
    panelPosition: uiStore.panelPosition,
    actions: {
      onSelect: panel => store.selectPanel(panel),
      toggleVisibility: () => uiStore.togglePanel(),
      togglePosition: () => uiStore.togglePanelPosition(),
    },
  };
}

export default inject(({ store, uiStore }) => mapper({ store, uiStore }))(AddonPanel);
