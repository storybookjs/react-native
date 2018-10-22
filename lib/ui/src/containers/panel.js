import { inject } from 'mobx-react';
import { types } from '@storybook/addons';

import AddonPanel from '../components/panel/panel';

export function mapper({ store, uiStore }) {
  return {
    panels: store.getElements(types.PANEL),
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
