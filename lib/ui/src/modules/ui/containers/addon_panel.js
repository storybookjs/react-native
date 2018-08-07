import { inject } from 'mobx-react';
import { AddonPanel } from '@storybook/components';

export function mapper(store, { panels }) {
  const selectedPanel = store.selectedAddonPanel;

  return {
    panels,
    selectedPanel,
    onPanelSelect: panel => store.selectAddonPanel(panel)
  };
}

export default inject(({ store }, props) => mapper(store, props))(AddonPanel);
