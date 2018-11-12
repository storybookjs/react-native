import React from 'react';
import AddonPanel from '../components/panel/panel';
import { Consumer } from '../core/context';

export default props => (
  <Consumer>
    {({ state, api }) => {
      const customProps = {
        panels: api.getPanels(),
        selectedPanel: api.getSelectedPanel(),
        panelPosition: state.ui.panelPosition,
        actions: {
          onSelect: panel => api.setSelectedPanel(panel),
          toggleVisibility: () => api.togglePanel(),
          togglePosition: () => api.togglePanelPosition(),
        },
      };

      return <AddonPanel {...props} {...customProps} />;
    }}
  </Consumer>
);
