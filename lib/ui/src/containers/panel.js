import React from 'react';
import AddonPanel from '../components/panel/panel';
import { Consumer } from '../core/context';

export default props => (
  <Consumer>
    {({ state, manager }) => {
      const customProps = {
        panels: manager.getPanels(),
        selectedPanel: manager.getSelectedPanel(),
        panelPosition: state.ui.panelPosition,
        actions: {
          onSelect: panel => manager.setSelectedPanel(panel),
          toggleVisibility: () => manager.togglePanel(),
          togglePosition: () => manager.togglePanelPosition(),
        },
      };

      return <AddonPanel {...props} {...customProps} />;
    }}
  </Consumer>
);
