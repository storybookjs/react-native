import React from 'react';
import PropTypes from 'prop-types';

import { Tabs } from '../tabs/tabs';

const AddonPanel = ({ panels, onPanelSelect, selectedPanel, ...rest }) => (
  <Tabs {...rest} absolute bordered selected={selectedPanel} onSelect={onPanelSelect}>
    {Object.entries(panels).map(([k, v]) => (
      <div key={k} id={k} title={v.title}>
        {v.render}
      </div>
    ))}
  </Tabs>
);
AddonPanel.propTypes = {
  selectedPanel: PropTypes.string,
  onPanelSelect: PropTypes.func.isRequired,
  panels: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      render: PropTypes.func,
    })
  ).isRequired,
};
AddonPanel.defaultProps = {
  selectedPanel: null,
};

export default AddonPanel;
