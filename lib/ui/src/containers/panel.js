import React from 'react';
import memoize from 'memoizerific';
import { Consumer } from '@storybook/api';

import AddonPanel from '../components/panel/panel';

const createPanelActions = memoize(1)(api => ({
  onSelect: panel => api.setSelectedPanel(panel),
  toggleVisibility: () => api.togglePanel(),
  togglePosition: () => api.togglePanelPosition(),
}));

export default props => (
  <Consumer>
    {({ state, api }) => {
      const customProps = {
        panels: api.getPanels(),
        selectedPanel: api.getSelectedPanel(),
        panelPosition: state.layout.panelPosition,
        actions: createPanelActions(api),
      };

      return <AddonPanel {...props} {...customProps} />;
    }}
  </Consumer>
);
