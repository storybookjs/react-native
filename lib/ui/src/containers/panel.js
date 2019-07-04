import React from 'react';
import memoize from 'memoizerific';
import { Consumer } from '@storybook/api';

import AddonPanel from '../components/panel/panel';

const createPanelActions = memoize(1)(api => ({
  onSelect: panel => api.setSelectedPanel(panel),
  toggleVisibility: () => api.togglePanel(),
  togglePosition: () => api.togglePanelPosition(),
}));

const mapper = ({ state, api }) => ({
  panels: api.getStoryPanels(),
  selectedPanel: api.getSelectedPanel(),
  panelPosition: state.layout.panelPosition,
  actions: createPanelActions(api),
});

export default props => (
  <Consumer filter={mapper}>{customProps => <AddonPanel {...props} {...customProps} />}</Consumer>
);
