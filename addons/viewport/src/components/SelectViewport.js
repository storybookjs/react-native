import React from 'react';
import PropTypes from 'prop-types';

import { viewports, defaultViewport } from './viewportInfo';
import * as styles from './styles';

export function SelectViewport({ activeViewport, onChange }) {
  return (
    <div style={styles.row}>
      <label style={styles.label}>Device</label>
      <select style={styles.action} value={activeViewport} onChange={onChange}>
        <option value={defaultViewport}>Default</option>
        {Object.keys(viewports).map(key =>
          <option value={key} key={key}>
            {viewports[key].name}
          </option>
        )}
      </select>
    </div>
  );
}

SelectViewport.propTypes = {
  onChange: PropTypes.func.isRequired,
  activeViewport: PropTypes.string.isRequired,
};
