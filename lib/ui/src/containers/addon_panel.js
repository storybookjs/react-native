import { inject } from 'mobx-react';
import { AddonPanel } from '@storybook/components';

export function mapper(store) {
  return {
    panels: store.panels,
    selectedPanel: store.selectedAddonPanel,
    onPanelSelect: panel => store.selectAddonPanel(panel),
  };
}

export default inject(({ store }, props) => mapper(store, props))(AddonPanel);
