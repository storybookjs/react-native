import React from 'react';
import memoize from 'memoizerific';
import { Consumer } from '@storybook/api';

import AddonPanel from '../components/panel/panel';

const createPanelActions = memoize(1)(api => ({
  onSelect: panel => api.setSelectedPanel(panel),
  toggleVisibility: () => api.togglePanel(),
  togglePosition: () => api.togglePanelPosition(),
}));

const filterPanel = (panels, storyParameters) => {
  if (!panels || !storyParameters) {
    return panels;
  }

  const filteredPanels = {};
  Object.entries(panels).forEach(([id, panel]) => {
    const { paramKey } = panel;
    const panelParameters = paramKey && storyParameters[paramKey];
    if (!panelParameters || !panelParameters.disabled) {
      filteredPanels[id] = panel;
    }
  });

  return filteredPanels;
};

const mapper = ({ state, api }) => ({
  panels: filterPanel(api.getPanels(), api.getParameters(state.storyId)),
  selectedPanel: api.getSelectedPanel(),
  panelPosition: state.layout.panelPosition,
  actions: createPanelActions(api),
});

export default props => (
  <Consumer filter={mapper}>{customProps => <AddonPanel {...props} {...customProps} />}</Consumer>
);
