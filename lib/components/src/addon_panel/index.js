import React from 'react';
import PropTypes from 'prop-types';

import { Tabs } from '../';

const AddonPanel = ({ panels, ...rest }) => (
  <Tabs {...rest} absolute bordered>
    {Object.entries(panels).map(([k, v]) => (
      <div id={k} title={v.title}>
        {v.render}
      </div>
    ))}
  </Tabs>
);
AddonPanel.propTypes = {
  panels: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    render: PropTypes.func,
  }).isRequired,
};

export default AddonPanel;
